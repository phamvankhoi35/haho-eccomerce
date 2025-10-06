// import type { AuthResponse } from "../types/auth";
import axiosClient from "./axiosClient";

const authService = {
    async loginApi(data: { email: string; password: string }) {
        console.log("Login API call:", axiosClient.defaults.baseURL + "/auth/login");
        const res = await axiosClient.post("/auth/login", data);
        return res.data; // { user, accessToken }
    },

    async signupApi(data: any) {
        const res = await axiosClient.post("/auth/signup", data);
        return res.data; // { user, accessToken }
    },

    async logoutApi() {
        await axiosClient.post("/auth/logout", {})
    },

    async refreshTokenApi() {
        const res = await axiosClient.post("/auth/refresh", {}, { withCredentials: true });
        return res.data;
    },
    // getProfileApi: () => axiosClient.get('/auth/profile').then((r) => r.data),
};

export default authService;