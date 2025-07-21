import React from 'react';
import { Box, Grid, Typography, Paper, Fade } from '@mui/material';
import bcpLogo from '../assets/bcp.webp';
import interbankLogo from '../assets/interbank.webp';
import scotiabankLogo from '../assets/scotiabank.webp';
import bbvaLogo from '../assets/bbva.webp';
import pichinchaLogo from '../assets/pichincha.webp';

const BanksSection = () => (
  <Box sx={{ bgcolor: '#fff', py: 3, px: { xs: 1, md: 6 }, borderBottom: '1px solid #eee' }}>
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
          <Typography variant="subtitle1" color="success.main" fontWeight={700}>
            Transferencias inmediatas <span style={{ fontWeight: 400 }}>(15 minutos)</span>
          </Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={4}>
            <Fade in timeout={1000}><img src={bcpLogo} alt="BCP" height={32} /></Fade>
            <Fade in timeout={1200}><img src={interbankLogo} alt="Interbank" height={32} /></Fade>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
          <Typography variant="subtitle1" color="primary" fontWeight={700}>
            Transferencias interbancarias <span style={{ fontWeight: 400 }}>(24 hrs)</span>
          </Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={4}>
            <Fade in timeout={1000}><img src={scotiabankLogo} alt="Scotiabank" height={32} /></Fade>
            <Fade in timeout={1200}><img src={bbvaLogo} alt="BBVA" height={32} /></Fade>
            <Fade in timeout={1400}><img src={pichinchaLogo} alt="Pichincha" height={32} /></Fade>
            <Fade in timeout={1600}><Box fontSize={18} color="#888">y otras entidades</Box></Fade>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default BanksSection; 