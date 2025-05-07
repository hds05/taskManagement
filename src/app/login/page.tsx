'use client';
import React, { useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from "next/link";

export default function LoginPage() {
    const [user, setUser] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = async () => {
        // Handle login logic here
    }

    return (
        <div className='bg-amber-400 p-3 text-center flex items-center justify-center h-screen' >
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-10 border-b-2 ">Login</h1>
                <form className='flex flex-col gap-2.5 w-[300px]' >
                    <label className='flex flex-col items-start'>
                        Email:
                        <input
                            className="w-full border border-gray-300 box-border bg-white text-base px-3 py-2 rounded"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            name="email"
                            placeholder="Email" />
                        {/* <input className="border-none bg-white-50 box-border-2xl"  type="text" name="username" /> */}
                    </label>
                    <br />
                    <label className='flex flex-col items-start'>
                        Password:
                        <div className="relative w-full flex items-center">
                            <input
                                className="w-full border border-gray-300 bg-white box-border text-base px-3 py-2 rounded"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={user.password}
                                onChange={(e) => setUser({ ...user, password: e.target.value })}
                            />
                            <button
                                type='button'
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOffIcon style={{ color: 'grey' }} /> : <VisibilityIcon style={{ color: 'black' }} />}
                            </button>
                        </div>
                    </label>
                    <br />
                    <button
                        className="w-full rounded-lg bg-green-600 p-4 text-white hover:bg-green-800"
                        onClick={onLogin}
                        type="submit">
                        Login
                    </button>
                </form>
                <p className="text-sm text-gray-800 mt-3">
                    Don't have an Account??{' '}
                    <Link className="underline text-blue-600" href='/signup'>SignUp</Link>
                </p>
            </div>
        </div>
    );
}