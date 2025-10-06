import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function GuestRoute() {
    const { isAuthenticated, loading } = useSelector((state: any) => state.auth);

    if (loading) return <div className="p-4 text-center">Loading...</div>;

    if (isAuthenticated) {
        // Đã login thì không cho vào login/register → redirect home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}