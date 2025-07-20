import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const Banner = () => (
  <Paper elevation={3} sx={{ p: 3, my: 3, background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)', color: 'white', textAlign: 'center' }}>
    <Typography variant="h4" fontWeight="bold">
      ¡Cambia tus dólares y soles al mejor precio!
    </Typography>
    <Typography variant="h6" sx={{ mt: 1 }}>
      Plataforma segura, rápida y confiable. <br />
      ¡Sin comisiones ocultas!
    </Typography>
  </Paper>
);

export default Banner; 