import React from 'react';
import { Box, Grid, Typography, Paper, Fade } from '@mui/material';
import bcpLogo from '../assets/bcp.svg';
import interbankLogo from '../assets/interbank.svg';
import scotiabankLogo from '../assets/scotiabank.svg';
import bbvaLogo from '../assets/bbva.svg';
import pichinchaLogo from '../assets/pichincha.svg';
import truenoIcon from '../assets/trueno.svg';
import relojIcon from '../assets/reloj.svg';

const BanksSection = () => (
  <Box sx={{ bgcolor: '#fff', py: 3, px: { xs: 1, md: 6 }, borderBottom: '1px solid #eee' }}>
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
          <Typography 
            variant="subtitle1"
            sx={{ fontFamily: 'Play, sans-serif', color: '#057c39', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <img src={truenoIcon} alt="trueno" style={{ width: 22, height: 22, marginRight: 4, filter: 'invert(36%) sepia(97%) saturate(747%) hue-rotate(92deg) brightness(93%) contrast(101%)' }} />
            Transferencias inmediatas <span style={{ fontWeight: 400 }}>(15 minutos)</span>
          </Typography>
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
            <Fade in timeout={1000}><img src={bcpLogo} alt="BCP" style={{ maxWidth: 90, width: '100%', height: 'auto', margin: '0 10px' }} /></Fade>
            <Fade in timeout={1200}><img src={interbankLogo} alt="Interbank" style={{ maxWidth: 90, width: '100%', height: 'auto', margin: '0 10px' }} /></Fade>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
          <Typography 
            variant="subtitle1"
            sx={{ fontFamily: 'Play, sans-serif', color: '#057c39', fontWeight: 700, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <img src={relojIcon} alt="reloj" style={{ width: 22, height: 22, marginRight: 4, filter: 'invert(36%) sepia(97%) saturate(747%) hue-rotate(92deg) brightness(93%) contrast(101%)' }} />
            Transferencias interbancarias <span style={{ fontWeight: 400 }}>(24 hrs)</span>
          </Typography>
          <Box mt={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
            <Fade in timeout={1000}><img src={scotiabankLogo} alt="Scotiabank" style={{ maxWidth: 90, width: '100%', height: 'auto', margin: '0 10px' }} /></Fade>
            <Fade in timeout={1200}><img src={bbvaLogo} alt="BBVA" style={{ maxWidth: 90, width: '100%', height: 'auto', margin: '0 10px' }} /></Fade>
            <Fade in timeout={1400}><img src={pichinchaLogo} alt="Pichincha" style={{ maxWidth: 90, width: '100%', height: 'auto', margin: '0 10px' }} /></Fade>
            <Fade in timeout={1600}><Box fontSize={18} color="#888" sx={{ ml: 1 }}>y otras entidades</Box></Fade>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);

export default BanksSection; 