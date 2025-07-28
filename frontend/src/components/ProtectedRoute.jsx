import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token, loading, profileComplete, checkProfileStatus } = useAuth();

  // Verificar el estado del perfil cuando el componente se monta
  useEffect(() => {
    if (token && user && !loading) {
      checkProfileStatus();
    }
  }, [token, user, loading, checkProfileStatus]);

  // Mostrar loading mientras se verifica el token
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f8f9fa'
      }}>
        <CircularProgress sx={{ color: '#057c39' }} />
      </Box>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el perfil está completado (solo para rutas que no sean completar perfil)
  if (!profileComplete && window.location.pathname !== '/complete-profile') {
    return <Navigate to={`/complete-profile?email=${user.email}`} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute; 
 