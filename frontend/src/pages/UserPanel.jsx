import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UserPanel = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel de Usuario
      </Typography>
      <Typography variant="body1">
        Aquí podrás crear órdenes y ver tu historial de cambios.
      </Typography>
      {/* Aquí irán los componentes de crear orden e historial */}
    </Box>
  );
};

export default UserPanel; 
 