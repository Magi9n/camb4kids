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

  const handleSwap = () => {
    setFade(true);
    setTimeout(() => {
      setSwap((s) => !s);
      setFade(false);
    }, 350);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: isMobile ? 600 : 400,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        bgcolor: '#c6ffd1',
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 6 },
        gap: { xs: 4, md: 0 },
        position: 'relative',
      }}
    >
      {/* Columna izquierda: texto y lottie */}
      <Box sx={{ flex: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', minWidth: 320, mr: { xs: 0, md: 6 } }}>
        <Fade in timeout={1200}>
          <Box sx={{ textAlign: 'left', mb: 2, width: '100%' }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 700, fontSize: { xs: 38, md: 54 }, color: '#222', mb: 1 }}>
              Tu cambio digital
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 900, fontSize: { xs: 44, md: 62 }, color: '#057c39', mb: 1 }}>
              de confianza en PERÚ
            </Typography>
          </Box>
        </Fade>
        <Grow in timeout={900}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <DotLottieReact
              src="https://lottie.host/46664ffb-e12d-4087-9bb4-9315ef7eb6be/XjwAOYmMzU.lottie"
              loop
              autoplay
              style={{ width: isMobile ? 260 : 400, height: isMobile ? 260 : 400 }}
            />
          </Box>
        </Grow>
      </Box>
      {/* Columna derecha: calculadora y swap */}
      <Grow in timeout={1200}>
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 320, mt: isMobile ? 4 : 0 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#222', mb: 0.5, lineHeight: 1.1 }}>
              Tipo de cambio para hoy
            </Typography>
            <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 22, md: 28 }, color: '#111', lineHeight: 1.1 }}>
              en <b style={{ color: '#111', fontWeight: 800 }}>MangosCash</b>
            </Typography>
          </Box>
          <Fade in={!fade} timeout={400}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Calculator swap={swap} onSwap={handleSwap} swapActive={fade || swap} />
            </Box>
          </Fade>
        </Box>
      </Grow>
    </Box>
  );
};

export default HeroSection; 