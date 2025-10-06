import axios from "axios";

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

// Nếu backend đã thêm token/accessToken vào htppOnly cookie thì hàm này ko cần thêm token
// Request interceptor (nếu cần thêm Authorization)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor: handle 401 -> try refresh (simple)
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // gọi trực tiếp axios (không dùng axiosClient để tránh vòng lặp interceptor)
                const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                const newAccessToken = refreshRes.data?.accessToken;
                if (newAccessToken) {
                    localStorage.setItem("accessToken", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest); // thử lại lần nữa
                }
            } catch (err) {
                localStorage.removeItem("accessToken");
                // redirect hoặc xử lý logout
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;