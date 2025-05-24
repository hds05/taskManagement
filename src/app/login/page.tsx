'use client';
import React, { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { toast as notifyToast } from "react-toastify";
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const onLogin = async () => {
        try {
            setLoading(true);
            const res = await axios.post('/api/users/login', user);
            console.log('Login response:', res.data);
            if (res.status === 200) {
                toast.success('Login successful!');
                // router.push('/profile'); // Redirect to dashboard or home page
                router.push('/tasks'); // Redirect to dashboard or home page
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Axios error, check response status and message
                const status = error.response?.status;
                const errorMsg = error.response?.data?.error;

                if (status === 403 && errorMsg === 'Your email is not verified. Please verify your email before logging in.') {
                    notifyToast.error('Please verify your email before logging in.');
                } else if (errorMsg) {
                    toast.error(errorMsg);
                } else {
                    toast.error('Login failed due to unknown server error.');
                }
            } else if (error instanceof Error) {
                // Generic JS error
                toast.error(`Login failed: ${error.message}`);
            } else {
                toast.error('An unknown error occurred during login.');
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        }
        else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className='p-3 text-center flex items-center justify-center h-screen bg-cover' style={{ backgroundImage: 'url("https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg")' }}>
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-1 border-b-2 ">Login</h1>
                <div className='flex flex-col gap-2.5 w-[300px]' >
                    <label className='flex flex-col items-start'>
                        Email:
                        <input
                            className="w-full border border-gray-300 box-border focus:ring-2 focus:ring-yellow-400 focus:outline-none  bg-white text-base px-3 py-2 rounded"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            name="email"
                            required
                            placeholder="Email" />
                        {/* <input className="border-none bg-white-50 box-border-2xl"  type="text" name="username" /> */}
                    </label>
                    <br />
                    <label className='flex flex-col items-start'>
                        Password:
                        <div className="relative w-full flex items-center">
                            <input
                                className="w-full border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white box-border text-base px-3 py-2 rounded"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
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
                        className={`w-full py-3 rounded-lg font-bold text-white transition duration-300 ${buttonDisabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'}`}
                        onClick={onLogin}
                        type="submit"
                        disabled={buttonDisabled || loading}
                    >
                        Login
                    </button>
                </div>
                <p className="text-sm text-gray-800 mt-3">
                    Don&apos;t have an Account??{' '}
                    <Link className="underline text-blue-600" href='/signup'>SignUp</Link>
                </p>
                <p className="text-xs text-gray-800 mt-1">
                    Forgot Password??{' '}
                    <Link className="underline text-blue-600" href='/forgotpassword'>Reset</Link>
                </p>
            </div>
        </div>
    );
}