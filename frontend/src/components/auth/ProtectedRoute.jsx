import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('voisafe_token');
  const user = JSON.parse(localStorage.getItem('voisafe_user') || 'null');
  const location = useLocation();

  if (!token || !user) {
    // Redirect to login but keep the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the required role, redirect to their default dashboard or home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
