'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Axios } from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignupPage() {
    
    const [user, setUser] = useState({ username: '', password: '', email: '' });
    const [showPassword, setShowPassword] = useState(false);
    const onSignup = async () => {

    }

    return (
        <div className='bg-amber-400 text-start flex items-center justify-center h-screen'>
            <div className='bg-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.2)]' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '20px', borderRadius: '8px', color: '#333' }}>
                <h1 className='mb-1 font-black font-inherit text-[30px]' >Signup</h1>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        Email:
                        <input
                            id='email'
                            type="email"
                            placeholder='Email'
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            style={{ width: '100%', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
                        />
                    </label>
                    <br />
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                        Username:
                        <input
                            id='username'
                            type="text"
                            placeholder='Username'
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            style={{ width: '100%', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
                        />
                    </label>
                    <br />
                    {/* <label className='flex flex-col items-start'>
                        Password:
                        <input 
                        type="password" 
                        placeholder='Password'
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        className='w-full p-2 bg-white border border-gray-300 rounded-sm'
                        />
                    </label> */}
                    <label className='flex flex-col items-start w-full'>
                        Password:
                        <div className='relative w-full flex items-center'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                                className=' w-full p-2 bg-white border border-gray-300 rounded-sm'
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
                        className='w-full p-3 mb-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out cursor-pointer'
                        type="submit"
                        onClick={onSignup}
                    >Signup
                    </button>

                </form>
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