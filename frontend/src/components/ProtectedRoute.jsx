import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/panel" replace />;
  }

  return children;
};

export default ProtectedRoute; 