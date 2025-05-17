'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    username: string;
    isVerified: boolean;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getUserDetails = async () => {
        try {
            const res = await axios.get('/api/users/profiledata', { withCredentials: true });
            console.log('Fetched user:', res.data);
            if (res.status === 200 && res.data.user) {
                setUser(res.data.user);
                console.log('User data after sign up:', res.data.user);

            }
        } catch  (error: unknown){
            // console.error("Failed to fetch user details:", error);
            setUser(null);
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    if (loading) {
        return <div className="h-screen flex justify-center items-center">Loading...</div>;
    }

    if (!user) {
        return <div className="h-screen flex justify-center items-center">User not found</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 p-6">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6">User Profile</h1>

                <div className="space-y-4 text-left">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Verified:</span>
                        <span className={`font-bold ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {user.isVerified ? 'Yes ✅' : 'No ❌'}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Username:</span>
                        <span className="font-medium text-gray-900">{user.username}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Email:</span>
                        <span className="font-medium text-gray-900">{user.email}</span>
                    </div>
                </div>
            </div>
        </div>

    );
}
