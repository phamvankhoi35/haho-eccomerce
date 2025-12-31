import axios from "axios";
import { logout, refreshAccessToken } from "../features/auth/authThunk";

/**
    withCredentials: true → gửi cookie httpOnly tới server.
    Request interceptor → thêm header Authorization nếu cần.
    Response interceptor → khi nhận 401, tự gọi refreshUser (sử dụng Redux thunk) và retry request.
    Nếu refresh token thất bại → gọi logout()
 */

const BASE_URL =
    // import.meta.env.VITE_API_URL || 
    'http://localhost:5000/api';

const axiosClient = axios.create({
    // baseURL: "https://fakestoreapi.com",
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // nếu dùng cookie httpOnly cho access/refresh
});

export const setupInterceptors = (store: any) => {
    let isRefreshing = false;
    let subscribers: ((token: string) => void)[] = [];

    const onTokenRefreshed = (token: string) => {
        subscribers.forEach(cb => cb(token));
        subscribers = [];
    };

    const addSubscriber = (callback: (token: string) => void) => {
        subscribers.push(callback);
    };

    axiosClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            // console.log("AccessToken gửi đi:", token);
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosClient.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise(resolve => {
                        addSubscriber((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(axiosClient(originalRequest));
                        });
                    });
                }

                isRefreshing = true;
                try {
                    const action = await store.dispatch(refreshAccessToken());
                    const newToken = (action.payload as string) || "";
                    onTokenRefreshed(newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosClient(originalRequest);
                } catch {
                    store.dispatch(logout());
                    window.location.href = "/auth/login"; // auto redirect về login page
                    return Promise.reject(error);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};


// // Nếu backend đã thêm token/accessToken vào htppOnly cookie thì hàm này ko cần thêm token
// // Request interceptor (nếu cần thêm Authorization)
// axiosClient.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem("accessToken");
//         if (token) config.headers.Authorization = `Bearer ${token}`;
//         return config;
//     },
//     (error) => Promise.reject(error)
// );
// response interceptor: handle 401 -> try refresh (simple)
// axiosClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 // gọi trực tiếp axios (không dùng axiosClient để tránh vòng lặp interceptor)
//                 const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
//                 const newAccessToken = refreshRes.data?.accessToken;
//                 if (newAccessToken) {
//                     localStorage.setItem("accessToken", newAccessToken);
//                     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                     return axiosClient(originalRequest); // thử lại lần nữa
//                 }
//             } catch (err) {
//                 localStorage.removeItem("accessToken");
//                 // redirect hoặc xử lý logout
//                 return Promise.reject(err);
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosClient;