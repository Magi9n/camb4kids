import React from 'react';
import { Box, Typography, Button, Paper, Grid, Fade } from '@mui/material';

const SimulatorSection = () => (
  <Box sx={{ py: 6, bgcolor: '#f6fff6' }}>
    <Grid container spacing={4} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6}>
        <Fade in timeout={1000}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">Enví­as soles</Typography>
            <Typography variant="h4" fontWeight={700} color="success.main">10,000.00 S/</Typography>
            <Typography variant="h6" color="text.secondary" mt={2}>Recibes dólares</Typography>
            <Typography variant="h4" fontWeight={700} color="primary.main">2,690.34 $</Typography>
            <Typography variant="body2" color="text.secondary" mt={2}>Ahorro Estimado: <b>S/150.00</b></Typography>
            <Typography variant="body2" color="text.secondary">Donet <b>1500</b> 🪙</Typography>
          </Paper>
        </Fade>
      </Grid>
      <Grid item xs={12} md={6}>
        <Fade in timeout={1300}>
          <Box textAlign="center">
            <Button variant="contained" color="success" size="large" sx={{ px: 6, py: 2, fontSize: 22, borderRadius: 3 }} href="/register">
              Regístrate
            </Button>
          </Box>
        </Fade>
      </Grid>
    </Grid>
  </Box>
);

export default SimulatorSection; 