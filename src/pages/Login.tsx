import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import axiosClient from '../api/axiosClient';
import { login } from '../features/auth/authThunk';
import { useAuth } from '../hooks/useAuth';
import { resetMessage } from '../features/auth/authSlice';
// import type { AxiosError } from 'axios';

const Login = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector(state => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: Location })?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await dispatch(login({ email, password })).unwrap().catch(() => null);
        if (res && res.user) {
            navigate(from, { replace: true }); // quay lại trang trước khi login đó
        }
    };



    return (
        <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-lg bg-white">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
            {error && <p className="p-3 mb-4 rounded bg-red-100 text-red-700">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border rounded"
                />

                <p>Bạn chưa có tài khoản? <Link to="/auth/signup">Signup</Link></p>
                <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

        </div>
    )
}

export default Login