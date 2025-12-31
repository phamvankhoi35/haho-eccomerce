import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getProfile } from "../features/auth/authThunk";

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const {
        user,
        accessToken,
        loading: authLoading,
    } = useAppSelector((state) => state.auth);

    // local state để check đã load profile chưa
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // Chỉ get profile nếu có token, chưa load profile, không đang logout
    useEffect(() => {
        if (accessToken && !user && !profileLoaded && !loggingOut) {
            dispatch(getProfile()).finally(() => setProfileLoaded(true));
        }
    }, [accessToken, user, profileLoaded, loggingOut, dispatch]);

    // True nếu có token và user
    const isAuthenticated = !!(accessToken && user && !loggingOut);

    const roles = Array.isArray(user?.roles)
        ? user.roles
        : user?.roles
            ? [user.roles]
            : [];

    const isAdmin = roles.includes("admin") || roles.includes("superadmin");
    const isUser = roles.includes("user");
    const isSeller = roles.includes("seller");

    return {
        user,
        accessToken,
        isAuthenticated,
        isAdmin,
        isUser,
        isSeller,
        roles,
        authLoading,
        loggingOut,
        setLoggingOut, // để Header dùng
    };

};