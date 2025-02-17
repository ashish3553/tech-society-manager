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
  

  // Optionally, load the email from localStorage if available.
  useEffect(() => {
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      toast.success(res.data.msg);
      setAuth({ token: res.data.token, user: res.data.user });
      // Optionally clear the stored email
      localStorage.removeItem('verificationEmail');
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.msg || 'Verification failed.');
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
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
