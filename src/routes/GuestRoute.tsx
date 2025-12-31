import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function GuestRoute() {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) return <div className="p-4 text-center">Loading...</div>;

    if (isAuthenticated) {
        // Đã login thì không cho vào login/register → redirect home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}