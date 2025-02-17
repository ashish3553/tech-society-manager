// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Use a function to initialize state so that it runs only once
  const [auth, setAuth] = useState(() => {
    // Retrieve the token and user string from localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    // Initialize user as null
    let user = null;

    // Check if userStr is present and is not the literal string "undefined"
    if (userStr && userStr !== "undefined") {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        user = null;
      }
    }

    // If both token and user are available, return an object; otherwise, return null
    return token && user ? { token, user } : null;
  });

  // Save auth state changes back to localStorage
  useEffect(() => {
    if (auth) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('user', JSON.stringify(auth.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
