'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function VerifyEmail() {

    const [token, setToken] = useState('');
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post('/api/users/verifyemail', { token });
            if (response.data.success) {
                setVerified(true);
            } else {
                setError(true);
            }
        } catch (error: any) {
            setError(true);
            console.log('Error verifying email:', error.response.data);
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split('=')[1];
        setToken(urlToken || '');
    }, []);

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className='text-4xl text-black' >Verify Email</h1>
            <h2 className='text-2xl bg-yellow-400 p-2 mt-1 rounded-lg'>{token ? `${token}` : "No Token"}</h2>
            {verified &&
                <div>
                    <h1 className="text-2xl font-bold text-green-600">Email verified successfully!</h1>
                    <Link href="/login">Login</Link>
                </div>
            }
            {error &&
                <div>
                    <h1 className="text-2xl font-bold text-red-600">Error verifying email. Please try again.
                    </h1>
                </div>}
            {/* {!verified && !error && <h1 className="text-2xl font-bold text-gray-600">Verifying your email...</h1>} */}
        </div>
    )
}