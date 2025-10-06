import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signup } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

const Signup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state) => state.auth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const resultAction = await dispatch(
            signup({ email, password, fullname })
        );
        if (signup.fulfilled.match(resultAction)) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate("/auth/login");
        }
    };

    return (
        <div className="flex justify-center items-center h-[80vh]">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-96"
            >
                <h2 className="text-xl font-bold mb-4">Signup</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    type="text"
                    placeholder="Fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                    required
                />
                <p className="mb-4">
                    Đã có tài khoản?{" "}
                    <Link className="text-blue-500" to="/auth/login">
                        Đăng nhập
                    </Link>
                </p>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>
            </form>
        </div>
    )
}

export default Signup