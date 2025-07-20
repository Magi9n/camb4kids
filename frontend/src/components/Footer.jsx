import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => (
  <Box sx={{ mt: 6, py: 3, textAlign: 'center', background: '#f5f5f5' }}>
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Camb4Kids. Todos los derechos reservados.
    </Typography>
  </Box>
);

export default Footer; 