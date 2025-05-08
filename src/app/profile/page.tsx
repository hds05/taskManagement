'use client';
import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState('NaN');

    const logout = async () => {
        try {
            const res = await axios.get('/api/users/logout');
            console.log('Logout response:', res.data);
            toast.success('Logout successful!');
            router.push('/login'); // Redirect to login page
                        
        } catch (error: any) {
            console.log('Logout failed:', error.response?.data);
            if (error.response && error.response.data?.error) {
                toast.error(error.response.data.error); // This is now a proper string
            } else {
                toast.error(`Logout failed: ${error.message}`);
            }
            
        }
    }
    const userDetails = async () => {
        try {
            const res = await axios.get('/api/users/profiledata');
            console.log('User details response:', res.data);
            if (res.status === 200) {
                setData(res.data.user._id); // Assuming the response contains user data
                toast.success('User details fetched successfully!');
            }
        }catch (error: any) {
            console.log('User details fetch failed:', error.response?.data);    
        }
    }
    return(
        <div className='p-3 text-center flex flex-col items-center justify-center h-screen' >
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-lg flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-10">Profile</h1>
                <p className="text-sm text-gray-800 mt-3">
                    This is the profile page.
                </p>
                <h3>{ data === 'NaN' ? "No Data" : <Link href={`/profile/${data}`}>{data}</Link>}</h3>
            </div>
            <button className='mt-2 text-white font-italic bg-red-600 px-[10px] py-[7px] rounded-lg' onClick={userDetails}>
                User Details
            </button>
            <button className='mt-2 text-white font-italic bg-red-600 px-[10px] py-[7px] rounded-lg' onClick={logout}>
                Logout
            </button>
        </div>
    )
}