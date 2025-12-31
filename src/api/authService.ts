// import type { AuthResponse } from "../types/auth";
import axiosClient from "./axiosClient";

const authService = {
    async sendOtpApi(email: string) {
        const res = await axiosClient.post('/auth/signup', { email });
        return res.data;
    },
    async verifyOtpApi(data: { email: string; code: string }) {
        const res = await axiosClient.post('/auth/verify-otp', data);
        return res.data; // { status, message, email }
    },
    async completeSignupApi(data: { email: string; password: string; fullname: string }) {
        const res = await axiosClient.post('/auth/complete-signup', data);
        return res.data; // { status, message, user, accessToken }
    },
    async resendOtpApi(email: string) {
        const res = await axiosClient.post('/auth/resend-otp', { email });
        return res.data; // { message }
    },

    async loginApi(data: { email: string; password: string }) {
        const res = await axiosClient.post('/auth/login', data);
        return res.data;
    },

    async getProfileApi() {
        const res = await axiosClient.get("/auth/profile")
        return res.data;
    },

    async updateProfileApi(data: { fullname?: string, avatar?: string }) {
        const res = await axiosClient.put("/auth/update-profile", data)
        return res.data;
    },

    async logoutApi() {
        const res = await axiosClient.post("/auth/logout");
        return res.data;
    },
    async refreshTokenApi() {
        const res = await axiosClient.post("/auth/refresh", {});
        return res.data;
    },
};

export default authService;