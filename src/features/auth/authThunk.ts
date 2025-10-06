import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../api/authService";
import type { AppDispatch } from "../../app/store";
// import { authFailure, authStart, authSuccess, logout } from "./authSlice";


// LOGIN
export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await authService.loginApi(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

// SIGNUP
export const signup = createAsyncThunk(
    "auth/signup",
    async (data: any, { rejectWithValue }) => {
        try {
            const res = await authService.signupApi(data);
            return res;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Signup failed");
        }
    }
);

// REFRESH TOKEN
export const refreshAccessToken = createAsyncThunk("auth/refresh", async () => {
    const res = await authService.refreshTokenApi();
    return res;
});


// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logoutApi();
});