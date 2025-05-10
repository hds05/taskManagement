'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-hot-toast';

export default function SignupPage() {

    const router = useRouter();
    const [user, setUser] = useState({ username: '', password: '', email: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/users/signup', user);
            console.log('Signup response:', res.data);
            if (res.status === 201) {
                toast.success('Signup successful!');
                router.push('/login');
            }
        } catch (error: any) {
            console.log('Signup failed:', error.response?.data);

            if (error.response && error.response.data?.error) {
                toast.error(error.response.data.error); // This is now a proper string
            } else {
                toast.error(`Signup failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        }
        else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className='bg-amber-400 text-start flex items-center justify-center h-screen'>

            <div className='bg-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-2 p-5 rounded-lg text-black' >

                <h1 className='mb-1 font-black font-inherit text-[30px] text-gray-700 border-b-2' >Signup</h1>

                <div className='flex flex-col gap-2 w-[300px]'>
                    <label className='flex flex-col items-start'>
                        Email:
                        <input
                            id='email'
                            type="email"
                            placeholder='Email'
                            required
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className='w-full p-2 bg-white border border-gray-300 rounded-sm text-base focus:ring-2 focus:ring-yellow-400 focus:outline-none'
                        />
                    </label>

                    <br />

                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        Username:
                        <input
                            id='username'
                            type="text"
                            required
                            placeholder='Username'
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className='w-full p-2 bg-white border border-gray-300 rounded-sm text-base focus:ring-2 focus:ring-yellow-400 focus:outline-none'
                        />
                    </label>

                    <br />

                    <label className='flex flex-col items-start w-full'>
                        Password:
                        <div className='relative w-full flex items-center'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                required
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                className=' w-full p-2 bg-white border border-gray-300 rounded-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none text-base'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute cursor-pointer right-2  text-sm text-blue-600 ml-3 bg-white p-1'
                            >
                                {showPassword ? <VisibilityOffIcon style={{ color: 'grey' }} /> : <VisibilityIcon style={{ color: 'black' }} />}
                            </button>
                        </div>
                    </label>

                    <br />

                    <button
                        className={`w-full p-3 mb-3 text-white rounded-lg  transition duration-300  ${buttonDisabled || loading ? ' bg-gray-500 cursor-not-allowed' : ' bg-blue-500 hover:bg-blue-700 cursor-pointer'}`}
                        type="submit"
                        onClick={onSignup}
                        disabled= {buttonDisabled || loading}
                    >
                        Signup
                    </button>

                </div>

                <p className="text-sm mt-2 text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login">
                        <span className="text-green-700 underline cursor-pointer">Login</span>
                    </Link>
                </p>

            </div>
        </div>
    );
}