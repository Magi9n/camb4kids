import React from 'react';
import { Box, Typography, Fade, Grid, Paper } from '@mui/material';
import Lottie from 'lottie-react';
import dineroconalas from '../assets/dineroconalas.json';
import astronautamillonario from '../assets/astronautamillonario.png';
import empresario from '../assets/empresario.json';

const BenefitsSection = () => (
  <Fade in timeout={1200}>
    <Box sx={{ py: 6, textAlign: 'center', bgcolor: '#fff', fontFamily: 'Roboto, sans-serif' }}>
      <Typography variant="h3" fontWeight={700} sx={{ color: '#179c46', fontFamily: 'Roboto, sans-serif', mb: 1 }}>
        Beneficios de MangosCash
      </Typography>
      <Typography variant="h4" fontWeight={400} sx={{ color: '#111', fontFamily: 'Roboto, sans-serif', mb: 5 }}>
        Tu casa de cambio digital en PERÚ
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Cuadro 1: Dolero23 */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'left', borderRadius: 6, minHeight: 200, minWidth: 200, maxWidth: 240, height: 200, width: '100%', bgcolor: '#f7f8fa', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 17, color: '#111', mb: 0.5 }}>
              Cupón <span style={{ color: '#179c46', fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>DOLERO23</span>
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 14, color: '#222', mb: 1 }}>
              Úsalo en tu primer cambio
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Lottie animationData={dineroconalas} loop autoplay style={{ width: 100, height: 100 }} />
            </Box>
          </Paper>
        </Grid>
        {/* Cuadro 2: Preferencial */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'left', borderRadius: 6, minHeight: 200, minWidth: 200, maxWidth: 240, height: 200, width: '100%', bgcolor: '#baffd7', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 17, color: '#111', mb: 0.5 }}>
              Cupón <span style={{ color: '#179c46', fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>PREFERENCIAL</span>
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 14, color: '#222', mb: 1 }}>
              Monto mayor a $10 000 o S/30 000
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <img src={astronautamillonario} alt="Astronauta millonario" style={{ width: 100, height: 100, objectFit: 'contain' }} />
            </Box>
          </Paper>
        </Grid>
        {/* Cuadro 3: Empresarial */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2, textAlign: 'left', borderRadius: 6, minHeight: 200, minWidth: 200, maxWidth: 240, height: 200, width: '100%', bgcolor: '#d6ffe9', boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)', mx: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 17, color: '#111', mb: 0.5 }}>
              Cupón <span style={{ color: '#179c46', fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>EMPRESARIAL</span>
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 14, color: '#222', mb: 1 }}>
              Tenemos la mejor tasa de cambio para tu empresa.
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Lottie animationData={empresario} loop autoplay style={{ width: 100, height: 100 }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </Fade>
);

export default BenefitsSection; 