// src/components/AuthGuard.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Function to check if token is expired (duplicated from AuthContext for direct use)
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if the expiration time is past
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration in AuthGuard:", error);
    return true; // Assume expired if there's an error
  }
};

const AuthGuard = ({ children }) => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not authenticated and not on login, register, or other public pages
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/verify-otp'];
    const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));
    
    // Check if token exists but is expired
    if (auth?.token && isTokenExpired(auth.token)) {
      logout(); // Logout the user
      navigate(`/login?expired=true&returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
      return;
    }
    
    // If not authenticated and not on a public path
    if (!auth && !isPublicPath) {
      // Redirect to login with return URL
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [auth, logout, navigate, location]);

  return <>{children}</>;
};

export default AuthGuard;