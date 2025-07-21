import React from 'react';
import { Box, Typography, Grid, Fade, Paper } from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const steps = [
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 48, color: 'primary.main' }} />,
    title: 'Cotiza tu cambio',
    desc: 'Ingresa el monto que vas a cambiar y cotiza tu cambio.',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 48, color: 'success.main' }} />,
    title: 'Transfiere',
    desc: 'Registra la cuenta destino, transfiere el monto a la cuenta.',
  },
  {
    icon: <AccountBalanceWalletIcon sx={{ fontSize: 48, color: 'warning.main' }} />,
    title: 'Recibe tu cambio',
    desc: 'Verifica tu operación y recibe tu cambio en tu cuenta.',
  },
];

const HowItWorks = () => (
  <Box sx={{ py: 6, bgcolor: '#fff' }}>
    <Typography variant="h4" fontWeight={700} color="success.main" textAlign="center" mb={4}>
      ¿Cómo Funciona?
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {steps.map((step, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Fade in timeout={1000 + i * 300}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, minHeight: 260 }}>
              {step.icon}
              <Typography variant="h6" fontWeight={700} mt={2} mb={1}>{step.title}</Typography>
              <Typography variant="body1" color="text.secondary">{step.desc}</Typography>
            </Paper>
          </Fade>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default HowItWorks; 