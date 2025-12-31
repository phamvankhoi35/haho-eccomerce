// =========== Thunk =============

import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../api/authService";

// STEP 1
export const sendOTP = createAsyncThunk(
    'auth/signup',
    async (email: string, { rejectWithValue }) => {
        try {
            const res = await authService.sendOtpApi(email);
            return res;
        }
        catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Send OTP failed");
        }
    }
);

// STEP 2
export const verifyOTP = createAsyncThunk('auth/verify-otp', async (data: { email: string; code: string }, { rejectWithValue }) => {
    try {
        const res = await authService.verifyOtpApi(data);
        return res;
    }
    catch (err: any) { return rejectWithValue(err.response?.data?.message || "Verify OTP failed"); }
});

// STEP 3
export const completeSignup = createAsyncThunk('auth/complete-signup', async (data: { email: string; fullname: string; password: string }, { rejectWithValue }) => {
    try {
        const res = await authService.completeSignupApi(data);
        return res; // { status: 'completed', message, user, accessToken }
    }
    catch (err: any) { return rejectWithValue(err.response?.data?.message || "Complete profile failed"); }
});

// RESEND OTP
export const resendOTP = createAsyncThunk('auth/resend-otp', async (email: string, { rejectWithValue }) => {
    try {
        const res = await authService.resendOtpApi(email);
        return res;
    }
    catch (err: any) { return rejectWithValue(err.response?.data?.message || "Resend OTP failed"); }
});


// LOGIN
export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await authService.loginApi(data);
            return res; // { user, accessToken }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const getProfile = createAsyncThunk(
    "auth/profile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authService.getProfileApi();
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Get profile failed");
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/update-profile",
    async (data: { fullname?: string; avatar?: string }, { rejectWithValue }) => {
        try {
            const res = await authService.updateProfileApi(data);
            return res; // { user, accessToken }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Update profile failed");
        }
    }
);


// ✅ Refresh Access Token
export const refreshAccessToken = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authService.refreshTokenApi();
            const newAccessToken = res.accessToken;
            if (!newAccessToken) throw new Error("No token received");
            localStorage.setItem("accessToken", newAccessToken);
            return newAccessToken; // ✅ bắt buộc return
        } catch (err: any) {
            localStorage.removeItem("accessToken");
            return rejectWithValue("Session expired, please log in again.");
        }
    }
);


// LOGOUT
export const logout = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await authService.logoutApi();
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            return true;
        } catch (err: any) {
            return rejectWithValue("Logout failed");
        }
    }
);