import React from 'react';
import { Box, Typography, Fade } from '@mui/material';

const BenefitsSection = () => (
  <Fade in timeout={1200}>
    <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#fff' }}>
      <Typography variant="h3" fontWeight={700} color="success.main" gutterBottom>
        Beneficios de DolarNet
      </Typography>
      <Typography variant="h5" color="text.primary" fontWeight={400}>
        Tu casa de cambio digital en PERÚ
      </Typography>
    </Box>
  </Fade>
);

export default BenefitsSection; 