import React from 'react';
import { Box, Typography, Grid, Paper, Fade } from '@mui/material';

const coupons = [
  {
    title: 'Cupón DOLERO23',
    desc: 'Úsalo en tu primer cambio',
    color: 'success.main',
    icon: '💸',
  },
  {
    title: 'Cupón PREFERENCIAL',
    desc: 'Monto mayor a $10 000 o S/30 000',
    color: 'info.main',
    icon: '🧑‍🚀',
  },
  {
    title: 'Cupón EMPRESARIAL',
    desc: 'Tenemos la mejor tasa de cambio para tu empresa.',
    color: 'warning.main',
    icon: '💼',
  },
];

const CouponsSection = () => (
  <Box sx={{ py: 6, bgcolor: '#fff' }}>
    <Typography variant="h4" fontWeight={700} color="success.main" textAlign="center" mb={4}>
      Beneficios de DolarNet
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      {coupons.map((c, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Fade in timeout={1000 + i * 300}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 4, minHeight: 200 }}>
              <Box fontSize={48} mb={2}>{c.icon}</Box>
              <Typography variant="h6" fontWeight={700} color={c.color}>{c.title}</Typography>
              <Typography variant="body1" color="text.secondary">{c.desc}</Typography>
            </Paper>
          </Fade>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default CouponsSection; 