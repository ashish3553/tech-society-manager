// src/pages/VerifyEmailPending.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const VerifyEmailPending = () => {
  // Try to retrieve the email from localStorage (set it during registration)
  const storedEmail = localStorage.getItem('verificationEmail') || '';
  const [email, setEmail] = useState(storedEmail);
  const [loading, setLoading] = useState(false);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/resend-verification', { email });
      toast.success(res.data.msg || 'Verification email sent!');
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.msg || 'Failed to send verification email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">
          Registration successful! Please check your email for a verification link.
          Once you verify your email, you can log in and access your dashboard.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          If you don't see the email, please check your spam folder.
        </p>
        <div className="mb-4">
          <label className="block text-gray-500 mb-1">
            Enter your email to resend verification:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="your-email@example.com"
            required
          />
        </div>
        <button
          onClick={handleResendVerification}
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors ${loading && 'opacity-50'}`}
        >
          {loading ? 'Sending...' : 'Resend Verification Email'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPending;
