import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OrderForm from '../components/OrderForm';

const UserPanel = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel de Usuario
      </Typography>
      <OrderForm />
      {/* Aquí irá el historial de órdenes */}
    </Box>
  );
};

export default UserPanel; 
 