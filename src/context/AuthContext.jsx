// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

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

    return token && user ? { token, user } : null;
  });

  // Determine admin status based on user role
  const isAdmin = auth?.user?.role === 'admin';

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
    <AuthContext.Provider value={{ auth, setAuth, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
