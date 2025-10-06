import type { AxiosError } from 'axios';
import React, { useState } from 'react';
import { login } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import axiosClient from '../api/axiosClient';


const Profile = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);

    const [email, setEmail] = useState(user?.email || "");
    const [name, setName] = useState(user?.fullname || "");

    const handleUpdate = async () => {
        try {
            const res = await axiosClient.put("/profile", { email, name });
            dispatch(login({ ...res.data })); // update Redux
            alert("Profile updated!");
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;

            // Check if the error object looks like an Axios error before accessing properties
            if (axiosError.response) {
                alert(axiosError.response.data?.message || "Update failed");
            } else {
                // Handle network or non-Axios related errors
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="flex flex-col gap-2">
                <label>Email:</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" />
                <label>Name:</label>
                <input value={name} onChange={e => setName(e.target.value)} className="border p-2 rounded" />
                <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded mt-2">Update</button>
            </div>
        </div>
    );
}

export default Profile