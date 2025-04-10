// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

// Function to parse JWT expiration time format
const parseJwtExpiresIn = (expiresIn) => {
  if (!expiresIn) return 7 * 24 * 60 * 60 * 1000; // Default: 7 days in milliseconds
  
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1), 10);
  
  if (isNaN(value)) return 7 * 24 * 60 * 60 * 1000; // Default if parsing fails
  
  switch(unit) {
    case 's': return value * 1000; // seconds to ms
    case 'm': return value * 60 * 1000; // minutes to ms
    case 'h': return value * 60 * 60 * 1000; // hours to ms
    case 'd': return value * 24 * 60 * 60 * 1000; // days to ms
    default: return value; // assume milliseconds
  }
};

// Calculate token check interval (1/10th of expiration time or at least every minute)
const getTokenCheckInterval = () => {
  const jwtExpiresIn = import.meta.env.VITE_JWT_EXPIRES_IN || '7d';
  const expirationMs = parseJwtExpiresIn(jwtExpiresIn);
  // Check at least once per minute, or more frequently for short-lived tokens
  return Math.min(Math.max(expirationMs / 10, 60000), 60000); // Between 1 minute and 10% of expiration time
};

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if the expiration time is past
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume expired if there's an error
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let user = null;

    if (userStr && userStr !== "undefined") {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        user = null;
      }
    }

    // Check if token is expired before returning auth state
    if (token && user && isTokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    return token && user ? { token, user } : null;
  });

  // Determine admin status based on user role
  const isAdmin = auth?.user?.role === 'admin';
  
  // Function to logout user
  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      
      // Set up interval to check token expiration using dynamic interval from env
      const tokenCheckInterval = getTokenCheckInterval();
      console.log(`Token check interval set to ${tokenCheckInterval}ms`);
      
      const checkTokenInterval = setInterval(() => {
        if (isTokenExpired(auth.token)) {
          logout();
          // We don't need to navigate here as the AuthGuard will handle redirection
        }
      }, tokenCheckInterval);
      
      return () => clearInterval(checkTokenInterval);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [auth, logout]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
