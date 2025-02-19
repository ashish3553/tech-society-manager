// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { HashLoader } from "react-spinners";



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false)
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await api.post('/auth/login', { email, password });
      console.log("Received data after login:", res.data);
      setAuth({ token: res.data.token, user: res.data.user });
      const role = res.data.user.role
      setLoading(false)
      navigate(role==="student"?'/dashboard':'/mentor'); // Redirect to dashboard after successful login
    } catch (err) {
      setLoading(false)
      console.error(err);
      toast.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
       {loading ?    <HashLoader className="text-center" size={35} color="white" />:"Login"}
            
            
          </button>
        </form>
        <div className="mt-4 flex flex-col items-center">
          {/* Forgot Password Link */}
          <Link to="/forgot-password" className="text-blue-600 hover:underline mb-2">
            Forgot Password?
          </Link>
          {/* Registration Link */}
          <p className="text-gray-700">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
