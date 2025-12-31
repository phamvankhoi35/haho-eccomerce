import { createSlice } from "@reduxjs/toolkit";
import {
    completeSignup, getProfile, login,
    logout, refreshAccessToken, resendOTP,
    sendOTP, updateProfile, verifyOTP
} from "./authThunk";


// Xác định loại Người dùng
export interface User {
    id: string;
    email: string;
    fullname?: string;
    roles: string[];
    avatar?: string;
}

type Step = 'email' | 'verify' | 'completed';

// Thêm refreshToken vào giao diện AuthState
interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    message: string | null;
    step: Step;
    emailForSignup: string | null;
}

const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const storedToken = localStorage.getItem("accessToken");
const initialState: AuthState = {
    user: storedUser,
    accessToken: storedToken,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
    message: null,
    step: 'email',
    emailForSignup: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetStep: (state) => {
            state.step = 'email';
            state.emailForSignup = null;
            state.error = null;
            state.message = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setMessage: (state, action) => {
            state.message = action.payload;
        },
        resetMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ---- SIGNUP: STEP 1 (SEND OTP) ----
        builder
            .addCase(sendOTP.pending, state => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(sendOTP.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload.message;
                if (payload.success) {
                    state.step = 'verify';
                    state.emailForSignup = payload.email || state.emailForSignup;
                }
            })
            .addCase(sendOTP.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
        // VERIFY OTP
        builder
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(verifyOTP.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.message = payload.message;
                if (payload.status === 'pending_completion') {
                    state.step = 'completed';
                    state.emailForSignup = payload.email;
                }
            })
            .addCase(verifyOTP.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
        // COMPLETE PROFILE
        builder
            .addCase(completeSignup.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(completeSignup.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                state.isAuthenticated = true;
                state.message = payload.message;
                localStorage.setItem('user', JSON.stringify(payload.user));
                localStorage.setItem('accessToken', payload.accessToken);
                state.step = 'email';
                state.emailForSignup = null;
            })
            .addCase(completeSignup.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
        // RESEND OTP
        builder
            .addCase(resendOTP.pending, state => { state.loading = true; state.error = null })
            .addCase(resendOTP.fulfilled, state => { state.loading = false })
            .addCase(resendOTP.rejected, (state, { payload }) => { state.loading = false; state.error = payload as string })

        // ---- LOGIN ----
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.accessToken = payload.accessToken;
                state.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify(payload.user));
                localStorage.setItem('accessToken', payload.accessToken);
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
        // PROFILE
        builder
            .addCase(getProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProfile.fulfilled, (state, { payload }) => {
                console.log("payload:", payload);
                state.loading = false;
                state.user = payload.user || payload;
                localStorage.setItem("user", JSON.stringify(state.user));
                state.isAuthenticated = true;
            })
            .addCase(getProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });

        // UPDATE PROFILE
        builder
            .addCase(updateProfile.fulfilled, (state, { payload }) => {
                state.user = payload.user;
            })
            .addCase(updateProfile.rejected, (state, { payload }) => {
                state.error = payload as string;
            });
        // ---- REFRESH TOKEN---
        builder
            .addCase(refreshAccessToken.fulfilled, (state, { payload }) => {
                state.accessToken = payload;
                state.isAuthenticated = true;
                // localStorage.setItem("accessToken", payload.accessToken);
                // if (payload.user) state.user = payload.user;
            }).addCase(refreshAccessToken.rejected, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
            });
        // ---- LOGOUT ----
        builder
            .addCase(logout.pending, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
                state.step = 'email';
                state.emailForSignup = null;
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            });

    },
});

export const { resetMessage, setMessage, setError, resetStep } = authSlice.actions;
export default authSlice.reducer;