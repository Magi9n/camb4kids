import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const AdminPanel = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel Administrativo
      </Typography>
      <Typography variant="body1">
        Aquí podrás gestionar márgenes, ver órdenes y estadísticas del sistema.
      </Typography>
      {/* Aquí irán los componentes de márgenes, órdenes y estadísticas */}
    </Box>
  );
};

export default AdminPanel; 