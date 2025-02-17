// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Verifying email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        setMessage(res.data);
        toast.success('Email verified successfully.');
      } catch (error) {
        setMessage('Verification failed. The token may be invalid or expired.');
        toast.error('Email verification failed.');
      }
    };
    if (token) {
      verifyEmail();
    } else {
      setMessage('No token provided.');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-2xl font-bold">{message}</h2>
    </div>
  );
};

export default VerifyEmail;
