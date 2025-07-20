import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <CurrencyExchangeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Camb4Kids
        </Typography>
        <Button color="inherit" variant="outlined">Iniciar sesión</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 