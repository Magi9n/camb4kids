import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logomangocash.webp';

const menuHoverStyle = {
  color: '#222',
  fontFamily: 'Roboto, sans-serif',
  cursor: 'pointer',
  position: 'relative',
  px: 1,
  '&:hover::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: '3px',
    bgcolor: '#057c39',
    borderRadius: 2,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    height: '3px',
    bgcolor: 'transparent',
    borderRadius: 2,
    transition: 'background 0.2s',
  },
};

const Header = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', fontFamily: 'Roboto, sans-serif', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={logo} alt="DolarNet" style={{ height: 38, marginRight: 10, maxWidth: 180 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mr: 2 }}>
          <Box component="span" sx={menuHoverStyle}>Nosotros</Box>
          <Box component="span" sx={menuHoverStyle}>Empresas</Box>
          <Box component="span" sx={menuHoverStyle}>Soporte</Box>
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
 