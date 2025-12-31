import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authThunk';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy user và trạng thái auth từ Redux
    const cart = useAppSelector(state => state.cart.items);
    const { user, isAuthenticated, isAdmin, isUser, loggingOut, setLoggingOut, authLoading } = useAuth();

    const handleLogout = async () => {
        setLoggingOut(true);

        // Xóa token localStorage trước để isAuthenticated = false ngay lập tức
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        await dispatch(logout());
        setLoggingOut(false);
        navigate("/auth/login");
    };

    console.log("Header user:", user); // co data
    console.log("isAuthenticated:", isAuthenticated); //false
    console.log("isUser:", isUser); // true
    console.log("isAdmin:", isAdmin); // false

    console.log("Access token:", localStorage.getItem("accessToken"));

    if (!user && isAuthenticated) {
        return <div className="p-2 text-center">Đang tải tài khoản...</div>;
    }

    return (
        <>
            <header
                style={{ boxShadow: "0 3px 5px 0 rgba(0, 0, 0, 0.1)" }}
                className={`fixed w-full top-0 left-0 bg-white flex justify-around items-center h-[60px]`}
            >

                {/* Link Home/Admin */}
                {isAdmin ? <Link to="/admin">Admin Panel</Link> : <Link to="/">Home</Link>}

                {/* User links */}
                {isUser && (
                    <>
                        <Link to="/profile">Hi, {user?.fullname}</Link>
                        <Link to="/cart">
                            Cart {cart.length > 0 ? `(${cart.length})` : ""}
                        </Link>
                        <Link to="/order">Order</Link>
                    </>
                )}

                {/* Admin dashboard */}
                {isAdmin && <Link to="/admin">Dashboard</Link>}

                {/* Nếu chưa login */}
                {!isAuthenticated && <Link to="/auth/login" className="text-blue-600 hover:underline">Login</Link>}

                {/* Nếu đã login */}
                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="cursor-pointer bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                )}

            </header >
        </>
    )
}

export default Header