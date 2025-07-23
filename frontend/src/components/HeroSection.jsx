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
        minHeight: isMobile ? 480 : 340,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'transparent',
        px: { xs: 2, md: 8 },
        py: { xs: 4, md: 6 },
        gap: { xs: 4, md: 0 },
        position: 'relative',
      }}
    >
      {/* Lottie a la izquierda */}
      <Grow in timeout={900}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 220 }}>
          <DotLottieReact
            src="https://lottie.host/46664ffb-e12d-4087-9bb4-9315ef7eb6be/XjwAOYmMzU.lottie"
            loop
            autoplay
            style={{ width: isMobile ? 180 : 260, height: isMobile ? 180 : 260 }}
          />
        </Box>
      </Grow>
      {/* Texto en el centro */}
      <Fade in timeout={1200}>
        <Box sx={{ flex: 2, textAlign: isMobile ? 'center' : 'left', px: { xs: 0, md: 4 }, py: { xs: 2, md: 0 } }}>
          <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400, fontSize: { xs: 28, md: 38 }, color: '#222', mb: 1 }}>
            Tu cambio digital
          </Typography>
          <Typography sx={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 700, fontSize: { xs: 32, md: 44 }, color: '#057c39', mb: 1 }}>
            de confianza en PERÚ
          </Typography>
        </Box>
      </Fade>
      {/* Calculadora a la derecha con flecha animada */}
      <Grow in timeout={1200}>
        <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 320 }}>
          <Fade in={!fade} timeout={400}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Calculator swap={swap} />
              <ArrowButton active={swap ? 1 : 0} onClick={handleSwap} sx={{ mx: { xs: 1, md: 2 } }}>
                <SwapVertIcon sx={{ fontSize: 38, color: '#057c39', transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)' }} />
              </ArrowButton>
            </Box>
          </Fade>
        </Box>
      </Grow>
    </Box>
  );
};

export default HeroSection; 