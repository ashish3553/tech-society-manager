// src/pages/Registration.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HashLoader } from "react-spinners";


function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading,setLoading]=useState(false)


  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simple password strength validation: at least 8 characters, one number, and one special character.
  const isPasswordStrong = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordStrong(password)) {
      toast.error('Password is too weak. It must be at least 8 characters long and include a number and a special character.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('branch', branch);
    formData.append('year', year);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }  
    try {
      setLoading(true)
      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.msg || 'Registration successful! Please check your email for the verification code.');
      localStorage.setItem('verificationEmail', email);
      localStorage.setItem('registrationToken', res.data.token); // if using new registration route
      setLoading(false)
      navigate('/verify-otp');
    } catch (err) {
      setLoading(false)
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.msg || 'Unknown error';
      toast.error(`Registration failed: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder='xyzd'
              className="w-full bg-white text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 placeholder-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder='xyz@gmail.com'
              className="w-full bg-white text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 placeholder-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder='jdfhjg@b43n'
              className="w-full bg-white text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 placeholder-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">Branch:</label>
            <input 
              type="text" 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)} 
              placeholder='CSE'
              className="w-full bg-white text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 placeholder-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">Year:</label>
            <input 
              type="number" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
              placeholder='2024' 
              className="w-full bg-white text-black px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 placeholder-opacity-50"
            />
          </div>
          <div>
            <label className="block text-gray-700">Profile Image (optional):</label>
            <input 
              type="file" 
              name="profileImage" 
              onChange={(e) => setProfileImage(e.target.files[0])}
              className="w-full"
              accept="image/*"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
                  {loading ?    <HashLoader className="text-center" size={35} color="white" />:"Register"}

          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
