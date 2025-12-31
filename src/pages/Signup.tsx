import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { resendOTP, sendOTP, verifyOTP, completeSignup } from '../features/auth/authThunk';
import { resetMessage, resetStep } from '../features/auth/authSlice';

const Signup = () => {
    const dispatch = useAppDispatch();

    const { step, emailForSignup, loading, message, error } = useAppSelector(state => state.auth);

    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: Location })?.from?.pathname || "/";


    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [fullname, setFullname] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (emailForSignup) setEmail(emailForSignup);
    }, [emailForSignup]);

    // Step 1: gửi OTP
    const handleSendOTP = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return dispatch(resetStep());
        await dispatch(sendOTP(email));
    };

    // Step 2: verify OTP
    const handleVerifyOTP = async (e: FormEvent) => {
        e.preventDefault();
        if (!otp || !emailForSignup) return;
        await dispatch(verifyOTP({ email: emailForSignup, code: otp }));
    };

    // Step 3: Hoàn tất Profile và Login (Sau khi đã có OTP)
    const handleComplete = async (e: FormEvent) => {
        e.preventDefault();
        if (!fullname || !password || !emailForSignup) return;
        await dispatch(completeSignup({ email: emailForSignup, fullname, password }));
        navigate(from, { replace: true }); // về trang trc đó
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (!emailForSignup) return;
        dispatch(resetMessage());
        await dispatch(resendOTP(emailForSignup));
    };

    const handleChangeEmail = () => {
        dispatch(resetStep()); // quay lại step 1
        setOtp("");
        setEmail("");
        setFullname("");
        setPassword("");
    };

    return (
        // <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-lg bg-white">
        //     <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        //     {message && <p className="p-3 mb-4 rounded bg-green-100 text-green-700">{message}</p>}
        //     {error && <p className="p-3 mb-4 rounded bg-red-100 text-red-700">{error}</p>}

        //     {step === "email" && (
        //         <form onSubmit={handleSendOTP} className="space-y-4">
        //             <input
        //                 type="email"
        //                 placeholder="Email"
        //                 value={email}
        //                 onChange={e => setEmail(e.target.value)}
        //                 required
        //                 className="w-full p-3 border rounded"
        //             />
        //             <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded">
        //                 {loading ? 'Sending...' : 'Send OTP'}
        //             </button>
        //         </form>
        //     )}

        //     {step === "verify" && (
        //         <form onSubmit={handleVerifyOTP} className="space-y-4">
        //             <input
        //                 type="text"
        //                 placeholder="OTP"
        //                 value={otp}
        //                 onChange={e => setOtp(e.target.value)}
        //                 required
        //                 className="w-full p-3 border rounded"
        //             />
        //             <div className="flex gap-3">
        //                 <button type="submit" disabled={loading} className="flex-1 p-3 bg-green-600 text-white rounded">
        //                     {loading ? 'Verifying...' : 'Verify OTP'}
        //                 </button>
        //                 <button type="button" onClick={handleResendOTP} disabled={loading} className="flex-1 p-3 bg-gray-500 text-white rounded">
        //                     {loading ? 'Sending...' : 'Resend OTP'}
        //                 </button>
        //             </div>
        //         </form>
        //     )}

        //     {step === "completed" && (
        //         <form onSubmit={handleComplete} className="space-y-4">
        //             <input
        //                 type="text"
        //                 placeholder="Full Name"
        //                 value={fullname}
        //                 onChange={e => setFullname(e.target.value)}
        //                 required
        //                 className="w-full p-3 border rounded"
        //             />
        //             <input
        //                 type="password"
        //                 placeholder="Password"
        //                 value={password}
        //                 onChange={e => setPassword(e.target.value)}
        //                 required
        //                 className="w-full p-3 border rounded"
        //             />
        //             <button type="submit" disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded">
        //                 {loading ? 'Submitting...' : 'Complete & Login'}
        //             </button>
        //         </form>
        //     )}

        //     {/* <div className="mt-4 text-center">
        //         {(message || error) && (
        //             <button onClick={handleReset} className="text-blue-600 underline">
        //                 Clear
        //             </button>
        //         )}
        //     </div> */}
        // </div>
        <div className="max-w-md mx-auto p-6 mt-10 border rounded-xl shadow-lg bg-white">
            <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

            {message && <p className="p-3 mb-4 rounded bg-green-100 text-green-700">{message}</p>}
            {error && <p className="p-3 mb-4 rounded bg-red-100 text-red-700">{error}</p>}

            {step === "email" && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border rounded"
                    />
                    <button type="submit" disabled={loading} className="w-full p-3 bg-blue-600 text-white rounded">
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {step === "verify" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <p className="text-gray-700">OTP đã gửi đến: <b>{email}</b></p>
                    <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        required
                        className="text-center w-full p-3 border rounded"
                    />
                    <div className="flex gap-3">
                        <button type="button" onClick={handleResendOTP} disabled={loading} className="cursor-pointer flex-1 p-3 bg-gray-500 text-white rounded">
                            {loading ? 'Sending...' : 'Resend OTP'}
                        </button>
                        <button type="submit" disabled={loading} className="cursor-pointer flex-1 p-3 bg-green-600 text-white rounded">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                    <button type="button" onClick={handleChangeEmail} className="mt-2 text-sm text-blue-600 underline">
                        Thay đổi email
                    </button>
                </form>
            )}

            {step === "completed" && (
                <form onSubmit={handleComplete} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullname}
                        onChange={e => setFullname(e.target.value)}
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
                    <button type="submit" disabled={loading} className="w-full p-3 bg-indigo-600 text-white rounded">
                        {loading ? 'Submitting...' : 'Complete & Login'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default Signup