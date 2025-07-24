import React, { useState, useMemo } from 'react';
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
import WalletIcon from '../assets/wallet.svg';

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
  // Estado para el ahorro y el valor de pen
  const [penValue, setPenValue] = useState('1000');
  const ahorro = useMemo(() => {
    const penNum = parseFloat(penValue);
    if (isNaN(penNum)) return '0.00';
    return (penNum * 0.0225).toFixed(2);
  }, [penValue]);

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
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        bgcolor: '#c6ffd1',
        px: { xs: 2, md: 6 },
        pt: { xs: 3, md: 6 },
        pb: { xs: 2, md: 4 },
        gap: { xs: 4, md: 0 },
        position: 'relative',
      }}
    >
      {/* Columna izquierda: texto y lottie */}
      <Box sx={{ flex: 2.2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minWidth: 420, mr: { xs: 0, md: 8 }, position: 'relative', zIndex: 2, overflow: 'visible' }}>
        {/* Lottie como fondo */}
        <Box sx={{ position: 'absolute', left: 0, top: 48, width: '100%', height: 480, zIndex: 1, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <DotLottieReact
            src="https://lottie.host/0a4be2ac-465d-4049-93db-469aff42e55c/rfadlw8YP6.lottie"
            loop
            autoplay
            style={{ width: 480, height: 480, opacity: 0.85 }}
          />
        </Box>
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'left', mb: 2, width: '100%', zIndex: 2, position: 'relative', mt: 0 }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 700, fontSize: { xs: 38, md: 54 }, color: '#222', mb: 1, lineHeight: 1.1, mt: 0 }}>
              Tu cambio digital
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 900, fontSize: { xs: 44, md: 62 }, color: '#057c39', mb: 1, lineHeight: 1.1, mt: 0 }}>
              de confianza en PERÚ
            </Typography>
          </Box>
        </Fade>
      </Box>
      {/* Columna derecha: calculadora y swap */}
      <Grow in timeout={1200}>
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 370, mt: isMobile ? 4 : 0, position: 'relative', zIndex: 1, height: 'auto', justifyContent: 'center', pt: { xs: 1, md: 2 } }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#222', mb: 0.5, lineHeight: 1.1 }}>
              Tipo de cambio para hoy
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#111', lineHeight: 1.1 }}>
              en <b style={{ color: '#111', fontWeight: 800 }}>MangosCash</b>
            </Typography>
          </Box>
          {/* Calculadora */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <Calculator swap={swap} onSwap={handleSwap} swapActive={fade || swap} onPricesChange={handlePricesChange} onPenChange={setPenValue} />
          </Box>
          {/* Ahorro aproximado */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, gap: 1 }}>
            <img src={WalletIcon} alt="Wallet" style={{ width: 32, height: 32, marginRight: 10 }} />
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#057c39', fontSize: 18 }}>
              Ahorro aproximado:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#222', fontSize: 20, ml: 1 }}>
              S/. {ahorro}
            </Typography>
          </Box>
        </Box>
      </Grow>
    </Box>
  );
};

export default HeroSection; 