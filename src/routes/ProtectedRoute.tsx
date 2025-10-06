import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
    roles?: "user" | "admin";
}

export default function ProtectedRoute({ roles }: Props) {
    const { isAuthenticated, user } = useSelector((state: any) => state.auth);

    const location = useLocation();

    // 1. Chưa đăng nhập → chuyển về login
    if (!isAuthenticated) {
        // Chưa login → redirect login
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // 2️. Nếu route yêu cầu roles, kiểm tra hợp lệ
    if (roles && !user.roles?.includes(roles)) {
        // Role không hợp lệ → redirect home
        return <Navigate to="/" replace />;
    }

    // Render các route con
    return <Outlet />;
}