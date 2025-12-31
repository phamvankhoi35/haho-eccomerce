// import { useEffect } from 'react';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getProfile, updateProfile } from '../features/auth/authThunk';
// import { getProfile } from '../features/auth/authThunk';

const Profile = () => {
    const dispatch = useAppDispatch();
    const { user, loading, error } = useAppSelector(state => state.auth);

    const [email, setEmail] = useState(user?.email || "");
    const [fullname, setFullname] = useState(user?.fullname || "");

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) setFullname(user.fullname || "");
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfile({ fullname }));
    };

    if (loading) return <p>Đang tải thông tin...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!user) return <p>Không tìm thấy thông tin người dùng.</p>;

    return (
        // <div className="p-4 max-w-md mx-auto">
        //     <h2 className="text-xl font-bold mb-4">Profile</h2>
        //     <div className="flex flex-col gap-2">
        //         <label>Email:</label>
        //         <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
        //         <label>Name:</label>
        //         <input value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" />
        //         <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mt-2">Update</button>
        //     </div>
        // </div>

        <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
            <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Tên:</strong> {user.fullname || "Chưa cập nhật"}</p>
        </div>
    );
}

export default Profile