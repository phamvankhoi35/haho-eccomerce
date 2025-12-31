import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
    roles?: ("user" | "admin" | "seller")[];
}

export default function ProtectedRoute({ roles }: Props) {
    const { isAuthenticated, user, authLoading } = useAuth();
    const location = useLocation();

    // 🟡 Khi đang tải (getProfile chưa xong) → tạm hiển thị loading
    if (authLoading) {
        return <div className="p-4 text-center">Đang tải thông tin...</div>;
    }

    // 1. Chưa đăng nhập → chuyển về login
    if (!isAuthenticated) {
        // Chưa login → redirect login
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // 2️. Nếu route yêu cầu roles, kiểm tra hợp lệ
    if (roles && user?.roles) {
        const hasRole = roles.some(r => user.roles.includes(r));
        if (!hasRole) {
            // role không hợp lệ → redirect home
            return <Navigate to="/" replace />;
        }
    }

    // Render các route con
    return <Outlet />;
}