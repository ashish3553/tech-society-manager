import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If auth becomes null during component lifecycle, this will trigger
    if (!auth) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [auth, navigate, location.pathname]);

  if (!auth) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;