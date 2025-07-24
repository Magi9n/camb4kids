import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Calculator from './Calculator';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const ArrowButton = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  borderRadius: '50%',
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
  width: 56,
  height: 56,
  cursor: 'pointer',
  margin: '0 16px',
  transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
  transform: active ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)',
  zIndex: 2,
  '&:hover': {
    background: '#e0f7ef',
    boxShadow: '0 4px 24px 0 rgba(5,124,57,0.15)',
  },
}));

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [swap, setSwap] = useState(false);
  const [fade, setFade] = useState(false);
  // Estado para los precios
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');

  const handleSwap = () => {
    setFade(true);
    setTimeout(() => {
      setSwap((s) => !s);
      setFade(false);
    }, 350);
  };

  // Función para recibir precios desde Calculator
  const handlePricesChange = (compra, venta) => {
    setPrecioCompra(compra);
    setPrecioVenta(venta);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: isMobile ? 600 : 500,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#c6ffd1',
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 6 },
        gap: { xs: 4, md: 0 },
        position: 'relative',
      }}
    >
      {/* Columna izquierda: texto y lottie */}
      <Box sx={{ flex: 2.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', minWidth: 420, mr: { xs: 0, md: 8 }, position: 'relative', zIndex: 2 }}>
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'left', mb: 2, width: '100%', zIndex: 3, position: 'relative' }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 700, fontSize: { xs: 38, md: 54 }, color: '#222', mb: 1, lineHeight: 1.1 }}>
              Tu cambio digital
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 900, fontSize: { xs: 44, md: 62 }, color: '#057c39', mb: 1, lineHeight: 1.1 }}>
              de confianza en PERÚ
            </Typography>
          </Box>
        </Fade>
        <Grow in timeout={900}>
          <Box
            sx={{
              width: '100%',
              maxWidth: 800,
              maxHeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
            }}
          >
            <DotLottieReact
              src="https://lottie.host/793ff47d-c46b-4c87-a567-da0a9fb2df11/X2rUyK0Cn4.lottie"
              loop
              autoplay
              style={{ width: 800, height: 800, maxWidth: '100%', maxHeight: '100%' }}
            />
          </Box>
        </Grow>
      </Box>
      {/* Columna derecha: calculadora y swap */}
      <Grow in timeout={1200}>
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 370, mt: isMobile ? 4 : 0, position: 'relative', zIndex: 1, height: 'auto', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#222', mb: 0.5, lineHeight: 1.1 }}>
              Tipo de cambio para hoy
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#111', lineHeight: 1.1 }}>
              en <b style={{ color: '#111', fontWeight: 800 }}>MangosCash</b>
            </Typography>
          </Box>
          {/* Calculadora */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Calculator swap={swap} onSwap={handleSwap} swapActive={fade || swap} onPricesChange={handlePricesChange} />
          </Box>
        </Box>
      </Grow>
    </Box>
  );
};

export default HeroSection; 