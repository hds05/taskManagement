'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        setButtonDisabled(!password || !confirmPassword || password !== confirmPassword);
    }, [password, confirmPassword]);

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            // const response = await axios.post('/api/users/resetpassword',
            //      {
            //     token,
            //     password
            // });
            toast.success('Password reset successful!');
            router.push('/login');
        } catch (error: unknown) {
            console.error('Error resetting password:', error);

            if (error instanceof AxiosError) {
                toast.error(error.response?.data?.error || 'Something went wrong');
            } else {
                toast.error('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='bg-amber-400 h-screen flex items-center justify-center'>
            <div className='bg-white text-gray-900 p-8 rounded shadow-md w-[320px] flex flex-col items-center gap-4'>
                <h1 className='text-xl font-bold text-gray-700'>Reset Password</h1>
                <label>Password
                    <input
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border w-full px-3 py-2 rounded'
                    />
                </label>
                <label>Confirm Password
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='border w-full px-3 py-2 rounded'
                    />
                </label>
                <button
                    onClick={handleResetPassword}
                    disabled={buttonDisabled || loading}
                    className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                </button>
            </div>
        </div>
    );
}
