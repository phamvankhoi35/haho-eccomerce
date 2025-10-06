import type { User } from "../features/auth/authSlice";

const STORAGE_KEY = "auth";

interface StoredAuth {
    user: User | null;
    refreshToken: string | null;
}

// Lưu auth vào localStorage
export const saveAuth = (auth: StoredAuth) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
};

// Đọc auth từ localStorage
export const loadAuth = (): StoredAuth => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { user: null, refreshToken: null };
    try {
        return JSON.parse(data) as StoredAuth;
    } catch {
        return { user: null, refreshToken: null };
    }
};

// Xoá auth
export const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEY);
};