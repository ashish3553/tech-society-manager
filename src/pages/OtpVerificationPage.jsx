// src/pages/VerifyOTP.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { setAuth } = useContext(AuthContext);
  const [registrationToken, setRegistrationToken] = useState('');

  // Load email and registration token from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('verificationEmail');
    const storedToken = localStorage.getItem('registrationToken');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedToken) {
      setRegistrationToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the email, otp, and token to the verification endpoint
      const res = await api.post('/auth/verify-otp', { email, otp, token: registrationToken });
      toast.success(res.data.msg);
      setAuth({ token: res.data.token, user: res.data.user });
      // Clear stored values
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('registrationToken');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.msg || 'Verification failed.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className="mb-4">
          Please enter the OTP sent to your email to verify your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Enter OTP"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Verify Email
          </button>
        </form>
        {/* Optionally add a "Resend OTP" button here */}
      </div>
    </div>
  );
};

export default VerifyOTP;
