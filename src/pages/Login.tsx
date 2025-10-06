import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
import { login, resetError } from '../features/auth/authSlice';
// import type { AxiosError } from 'axios';


const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const location = useLocation();
    const from = (location.state as { from?: Location })?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const resultAction = await dispatch(login({ email, password }));
        if (login.fulfilled.match(resultAction)) {
            navigate(from, { replace: true }); // quay lại trang trước đó
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded" />
                <p>Bạn chưa có tài khoản?
                    <span className='text-red-500 cursor-pointer' onClick={() => {
                        dispatch(resetError());
                        navigate("/auth/signup");
                    }}>Đăng ký ngay
                    </span>
                </p>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Login