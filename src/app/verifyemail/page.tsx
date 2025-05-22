'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    const urlToken = window.location.search.split('=')[1];
    setToken(urlToken || '');
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      const verifyUserEmail = async () => {
        try {
          setLoading(true);
          const response = await axios.post('/api/users/verifyemail', { token });
          setVerified(response.data.success);
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover p-4" style={{ backgroundImage: 'url("https://png.pngtree.com/background/20250209/original/pngtree-flowers-frame-green-paper-free-printable-picture-image_13243021.jpg")' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Verification</h1>

        <button
          onClick={() => setShowToken((prev) => !prev)}
          className="text-xs text-blue-500 hover:underline mb-2"
        >
          {showToken ? 'Hide Token' : 'Show Token'}
        </button>

        {showToken && (
          <div className="text-xs bg-gray-100 p-2 rounded mb-4 break-all text-gray-700 border border-gray-300">
            {token || 'No token found'}
          </div>
        )}

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {verified && !loading && (
          <div className="mt-4">
            <h2 className="text-lg font-medium text-green-600">Email verified successfully!</h2>
            <Link
              href="/login"
              className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {error && !loading && (
          <div className="mt-4">
            <h2 className="text-lg font-medium text-red-600">
              Failed to verify email. Please try again later.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
