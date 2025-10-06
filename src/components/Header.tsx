import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout } from '../features/auth/authSlice';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Lấy user và trạng thái auth từ Redux
    const cart = useAppSelector(state => state.cart.items);
    const { user, isAuthenticated, roles } = useAuth();

    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await dispatch(logout()).unwrap(); // gọi thunk logout từ authSlice
            navigate("/auth/login");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setLoggingOut(false);
        }
    };

    // Nếu là USER → giao diện user
    return (
        <>
            <header
                style={{ boxShadow: "0 3px 5px 0 rgba(0, 0, 0, 0.1)" }}
                className={`fixed w-full top-0 left-0 bg-white flex justify-around items-center h-[60px]`}
            >
                {/* {
                    user?.role === "admin"
                        ? <><Link to="/admin">Admin Panel</Link></>
                        : <><Link to="/">Home</Link></>
                }
                {
                    user?.role === "user"
                        ?
                        <>
                            <Link to="/profile">Hi, {user.fullname}</Link>
                            <Link to="/cart">Cart {cart.length !== 0 ? <>({cart.length})</> : <></>}</Link>
                            <Link to="/order">Order</Link>
                        </>
                        :
                        user?.role === "admin" ? (
                            <>
                                <Link to="/admin">Dashboard</Link>
                            </>
                        )
                            :
                            (
                                <>
                                    <Link to="/auth/login">Login</Link>
                                </>
                            )
                } */}



                {/* Link Home/Admin */}
                {roles?.includes("admin") ? <Link to="/admin">Admin Panel</Link> : <Link to="/">Home</Link>}

                {/* User links */}
                {roles?.includes("user") && (
                    <>
                        <Link to="/profile">Hi, {user?.fullname}</Link>
                        <Link to="/cart">
                            Cart {cart.length > 0 ? `(${cart.length})` : ""}
                        </Link>
                        <Link to="/order">Order</Link>
                    </>
                )}

                {/* Admin dashboard */}
                {roles?.includes("admin") && <Link to="/admin">Dashboard</Link>}

                {/* Guest links */}

                {/* {!user && <Link to="/auth/login">Login</Link>}
                
                {
                    user && (
                        <>
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded">
                                {loggingOut ? "Logging out..." : "Logout"}
                            </button>
                        </>
                    )
                } */}

                {/* Nếu chưa login */}
                {!isAuthenticated && <Link to="/auth/login">Login</Link>}

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