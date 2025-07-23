import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logomangocash.webp';

const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', fontFamily: 'Roboto, sans-serif', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={logo} alt="DolarNet" style={{ height: 38, marginRight: 10 }} />
          <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: '#222', fontFamily: 'Roboto, sans-serif', letterSpacing: 0 }}>
            D<span style={{ color: '#057c39' }}>olar</span>Net
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 2 }}>
          <Typography variant="body1" sx={{ color: '#222', fontFamily: 'Roboto, sans-serif', cursor: 'pointer' }}>Nosotros</Typography>
          <Typography variant="body1" sx={{ color: '#222', fontFamily: 'Roboto, sans-serif', cursor: 'pointer' }}>Empresas</Typography>
          <Typography variant="body1" sx={{ color: '#222', fontFamily: 'Roboto, sans-serif', cursor: 'pointer' }}>Soporte</Typography>
          <Button onClick={() => navigate('/login')} sx={{ color: '#057c39', fontWeight: 500, fontFamily: 'Roboto, sans-serif', textTransform: 'none', fontSize: 17, background: 'none', boxShadow: 'none', minWidth: 0, px: 1 }}>
            Iniciar sesión
          </Button>
          <Button onClick={() => navigate('/register')} sx={{ color: 'white', background: 'black', borderRadius: 999, fontWeight: 700, fontFamily: 'Roboto, sans-serif', textTransform: 'none', fontSize: 17, px: 3, py: 1, ml: 1, '&:hover': { background: '#222' } }}>
            Registrarse
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
 