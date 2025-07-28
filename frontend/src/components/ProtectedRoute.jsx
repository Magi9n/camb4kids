import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, adminOnly = false, requireProfile = true }) => {
  const { user, token, loading, profileComplete, checkProfileStatus } = useAuth();

  useEffect(() => {
    // Verificar el estado del perfil cuando el componente se monta
    if (token && user && requireProfile) {
      checkProfileStatus();
    }
  }, [token, user, requireProfile, checkProfileStatus]);

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

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Si requiere perfil completo y no lo está, redirigir a completar perfil
  if (requireProfile && !profileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute; 
 