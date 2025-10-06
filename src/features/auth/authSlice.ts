import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../api/authService";


// Xác định loại Người dùng
export interface User {
    id: string;
    email: string;
    fullname?: string;
    roles: string[];
}

// Thêm refreshToken vào giao diện AuthState
interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error?: string | null;
}

const initialState: AuthState = {
    // user: null,
    // accessToken: null,
    // isAuthenticated: false,
    // loading: false,
    // error: null,

    user: JSON.parse(localStorage.getItem("user") || "null"),
    accessToken: localStorage.getItem("accessToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
}

// =========== Thunk =============
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
export const refreshAccessToken = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authService.refreshTokenApi();
            return res; // { accessToken }
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Refresh failed");
        }
    });


// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logoutApi();
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ---- LOGIN ----
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                localStorage.setItem("user", JSON.stringify(payload.user));
                localStorage.setItem("accessToken", payload.accessToken);
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })

            // ---- SIGNUP ----
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                localStorage.setItem("user", JSON.stringify(payload.user));
                localStorage.setItem("accessToken", payload.accessToken);
            })
            .addCase(signup.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })

            // ---- REFRESH TOKEN ----
            .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
                state.accessToken = payload.accessToken;
                localStorage.setItem("accessToken", payload.accessToken);
            })
            .addCase(refreshAccessToken.rejected, (state) => {
                // Nếu refresh lỗi => clear
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            })

            // ---- LOGOUT ----
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;