import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { user, token, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleMenuOption = (route) => {
    handleMenuClose();
    navigate(route);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.name ? user.name : user.email.split('@')[0];
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', fontFamily: 'Roboto, sans-serif', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ minHeight: 64, px: { xs: 1, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box sx={{ width: 220, maxWidth: 260, minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', ml: 5, mr: 1, py: 1 }}>
            <img src={logo} alt="MangosCash" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 3, 
          mr: 2
        }}>
          <Box component="span" sx={menuHoverStyle}>Nosotros</Box>
          <Box component="span" sx={menuHoverStyle}>Empresas</Box>
          <Box component="span" sx={menuHoverStyle}>Soporte</Box>
          
          {user && token ? (
            // Usuario logueado - Mostrar nombre con menú desplegable
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              position: 'relative'
            }}>
              <Button
                onClick={handleMenuClick}
                sx={{
                  color: '#057c39',
                  fontWeight: 600,
                  fontFamily: 'Roboto, sans-serif',
                  textTransform: 'none',
                  fontSize: 16,
                  background: 'none',
                  boxShadow: 'none',
                  minWidth: 0,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  '&:hover': {
                    background: 'rgba(5, 124, 57, 0.08)',
                  }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#057c39', fontSize: 14, mr: 1 }}>
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                  {getUserDisplayName()}
                </Typography>
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: 2,
                    '& .MuiMenuItem-root': {
                      fontFamily: 'Roboto, sans-serif',
                      fontSize: 14,
                      py: 1.5,
                      px: 2,
                    }
                  }
                }}
                slotProps={{
                  paper: {
                    style: {
                      position: 'fixed'
                    }
                  }
                }}
              >
                <MenuItem onClick={() => handleMenuOption('/')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    🏠 Inicio
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuOption('/dashboard')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    📊 Dashboard
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuOption('/cambiar-divisas')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    💱 Cambiar Divisas
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuOption('/mis-cuentas')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    🏦 Mis Cuentas
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuOption('/mis-alertas')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    🔔 Mis Alertas
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuOption('/configuracion')}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    ⚙️ Configuración
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ 
                  borderTop: '1px solid #e0e0e0',
                  color: '#d32f2f',
                  '&:hover': { background: 'rgba(211, 47, 47, 0.08)' }
                }}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    🚪 Cerrar Sesión
                  </Typography>
                </MenuItem>
              </Popover>
            </Box>
          ) : (
            // Usuario no logueado - Mostrar botones de login/register
            <>
              <Button onClick={() => navigate('/login')} sx={{ color: '#057c39', fontWeight: 500, fontFamily: 'Roboto, sans-serif', textTransform: 'none', fontSize: 17, background: 'none', boxShadow: 'none', minWidth: 0, px: 1 }}>
                Iniciar sesión
              </Button>
              <Button onClick={() => navigate('/register')} sx={{ color: 'white', background: 'black', borderRadius: 999, fontWeight: 700, fontFamily: 'Roboto, sans-serif', textTransform: 'none', fontSize: 17, px: 3, py: 1, ml: 1, '&:hover': { background: '#222' } }}>
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
 