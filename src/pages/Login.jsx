import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HashLoader } from "react-spinners";
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('expired');
  const location = useLocation();
  
  // Show session expired message if redirected due to token expiration
  useEffect(() => {
    if (expired === 'true') {
      toast.info('Your session has expired. Please log in again.');
    }
  }, [expired]);

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      setAuth({ token: res.data.token, user: res.data.user });
      const role = res.data.user.role;
      setLoading(false);
      navigate(role === "student" ? '/dashboard' : '/mentor');
      toast.success('Login successful!');
    } catch (err) {
      setLoading(false);
      console.error(err);
      const errorMsg = err.response?.data?.msg || 'Login failed';
      toast.error(errorMsg);
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
              Welcome Back
              <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full mt-2 mx-auto"></div>
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-gray-900 bg-opacity-50 pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-700 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

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
                  <span className="ml-2">Signing in...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In
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
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline">
                Sign up
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

export default Login;