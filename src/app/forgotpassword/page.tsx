'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        const isValidEmail = /^\S+@\S+\.\S+$/.test(email);
        setButtonDisabled(!isValidEmail);
    }, [email]);
    useEffect(() => {
        setButtonDisabled(email.trim() === '');
    }, [email]);


    const sendResetLink = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/users/forgotpassword', { email });
            if (res.status === 200) {
                toast.success('Reset link sent to your email!');
                router.push('/login'); // Redirect to login page
            }
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && "response" in error) {
                const err = error as { response?: { data?: { error?: string } } };
                console.log('Error sending reset link:', err.response?.data);

                if (err.response?.data?.error) {
                    toast.error(err.response.data.error);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            } else if (error instanceof Error) {
                // Generic JS error
                console.log('Error sending reset link:', error.message);
                toast.error(`Error: ${error.message}`);
            } else {
                // Fallback for unknown shapes
                console.log('Unknown error:', error);
                toast.error("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='bg-amber-400 p-3 text-center flex items-center justify-center h-screen' >
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-10 border-b-2 ">Forget Password</h1>
                <div className='flex flex-col gap-2.5 w-[300px]' >
                    <label className='flex flex-col items-start'>
                        Email:
                        <input
                            className="w-full border border-gray-300 box-border bg-white text-base px-3 py-2 rounded "
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            required
                        />
                    </label>
                    <button
                        disabled={buttonDisabled || loading}
                        onClick={sendResetLink}
                        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                    </button>
                </div>
                <p className='text-[15px] text-gray-500 mt-1'>
                    Back to
                    <Link href="/login" className='text-[15px] text-blue-500 underline'> Login</Link>
                </p>

            </div>
        </div>
    )
}