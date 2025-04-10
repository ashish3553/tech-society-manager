import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HashLoader } from "react-spinners";
import { motion } from 'framer-motion';

function Registration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Simple password strength validation: at least 8 characters, one number, and one special character.
  const isPasswordStrong = (pwd) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(pwd);
  };

  // Handle 3D rotation effect on mouse move
  const handleMouseMove = (e) => {
    const card = document.querySelector('.card-3d');
    if (!card) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = card.getBoundingClientRect();
    
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    
    const rotateX = 10 * (0.5 - y);
    const rotateY = 10 * (x - 0.5);
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetCardPosition = () => {
    const card = document.querySelector('.card-3d');
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    }
  };

  // Preview uploaded profile image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

    try {
      setLoading(true);
      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.msg || 'Registration successful! Please check your email for the verification code.');
      localStorage.setItem('verificationEmail', email);
      localStorage.setItem('registrationToken', res.data.token);
      setLoading(false);
      navigate('/verify-otp');
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.msg || 'Unknown error';
      toast.error(`Registration failed: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        {/* Grid lines */}
        <div className="grid-background"></div>
        
        {/* Animated glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-2/3 w-48 h-48 bg-pink-600 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* Animated floating particles */}
        <div className="particles"></div>
      </div>
      
      {/* 3D Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div 
          className="card-3d bg-gray-800 bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 transition-all duration-300"
          onMouseMove={handleMouseMove}
          onMouseLeave={resetCardPosition}
        >
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-3xl font-bold text-white text-center relative">
              Create Account
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mt-2 mx-auto"></div>
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile image preview */}
            <div className="flex justify-center mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600 shadow-lg"
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="group"
              >
                <label className="block text-gray-300 text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="John Doe"
                    className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="group"
              >
                <label className="block text-gray-300 text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="your@email.com"
                    className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="group"
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-3 text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                />
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters with a number and special character</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ y: -3 }}
                className="group"
              >
                <label className="block text-gray-300 text-sm font-medium mb-1">Branch</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={branch} 
                    onChange={(e) => setBranch(e.target.value)} 
                    placeholder="CSE"
                    className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -3 }}
                className="group"
              >
                <label className="block text-gray-300 text-sm font-medium mb-1">Year</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024" 
                    className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                  />
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                </div>
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="group"
            >
              <label className="block text-gray-300 text-sm font-medium mb-1">Profile Image</label>
              <div className="relative">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-cyan-500 transition-colors cursor-pointer bg-gray-900 bg-opacity-50">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-cyan-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-cyan-400 hover:text-cyan-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          onChange={handleImageChange}
                          accept="image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70"
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <HashLoader size={24} color="white" />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Register
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400"
            >
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline">
                Log in
              </Link>
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Add CSS for animations */}
      <style jsx>{`
        .grid-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(30, 64, 175, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 64, 175, 0.1) 1px, transparent 1px);
          animation: grid-move 15s linear infinite;
        }
        
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
        
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .particles::before,
        .particles::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 70%);
          animation: pulse 5s ease-in-out infinite alternate;
        }
        
        .particles::after {
          background: radial-gradient(circle at center, rgba(192, 132, 252, 0.05) 0%, rgba(192, 132, 252, 0) 70%);
          animation-delay: 2.5s;
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        /* Add shimmer effect to the card */
        .card-3d::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(30deg);
          animation: shimmer 6s linear infinite;
          pointer-events: none;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(30deg); }
          100% { transform: translateX(100%) rotate(30deg); }
        }
      `}</style>
    </div>
  );
}

export default Registration;