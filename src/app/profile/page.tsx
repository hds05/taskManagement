'use client';
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();

    const logout = async () => {
        try {
            const res = await axios.get('/api/users/logout');
            toast.success('Logout successful!');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Logout failed");
        }
    };

    const goToUserProfile = () => {
        router.push('/profile/user'); // Replace with your dynamic route if needed
    };

    return (
        <div className='bg-amber-400 p-3 text-center flex flex-col items-center justify-center h-screen'>
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-lg flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-10">Welcome</h1>
                <p className="text-sm text-gray-800 mt-3">Click below to view your profile</p>
                <button onClick={goToUserProfile} className='text-white bg-blue-600 px-4 py-2 rounded-lg'>
                    Go to Profile
                </button>
            </div>
            <button className='mt-4 text-white bg-red-600 px-4 py-2 rounded-lg' onClick={logout}>
                Logout
            </button>
        </div>
    );
}
