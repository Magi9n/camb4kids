import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import bgCupon from '../assets/fontobilletescupon.webp';

const neonColor = '#057c39';

const BannerCupon = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100vw',
        maxWidth: '100vw',
        overflowX: 'hidden',
        background: 'transparent',
        mt: 0,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          minHeight: isMobile ? 160 : 140,
          height: isMobile ? 170 : 140,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 0,
          py: 0,
          background: `linear-gradient(90deg, #23FFBD 0%, rgba(35,255,189,1) 40%, rgba(248,244,221,0.7) 100%)`,
          borderRadius: 0,
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Fondo de billetes */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            background: `url(${bgCupon}) right center/cover no-repeat`,
            opacity: 0.18,
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
          }}
        />
        {/* Contenido */}
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: { xs: 32, md: 64 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Typography sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 400, lineHeight: 1, fontSize: '3rem', mb: 0, mt: 0 }}>
              Usa el cupon
            </Typography>
            <Typography sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 700, lineHeight: 1, fontSize: '3rem', mb: 0, mt: 0 }}>
              &gt; Dolero23
            </Typography>
          </Box>
          <Button
            sx={{
              background: 'black',
              borderRadius: 6,
              px: { xs: 3, md: 7 },
              py: { xs: 0.5, md: 1.2 },
              fontSize: { xs: 22, md: 34 },
              fontFamily: 'Bangers, Impact, Arial Black, sans-serif',
              color: 'white',
              fontWeight: 700,
              boxShadow: `0 0 12px 1px ${neonColor}, 0 0 24px 2px rgba(0,0,0,0.18)`,
              textShadow: `0 0 6px ${neonColor}, 0 0 12px ${neonColor}`,
              letterSpacing: 2,
              transition: 'box-shadow 0.2s',
              ml: 0,
              mr: 0,
              alignSelf: 'center',
              '&:hover': {
                boxShadow: `0 0 24px 6px ${neonColor}, 0 0 24px 6px rgba(0,0,0,0.22)`
              }
            }}
          >
            CAMBIA AHORA
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BannerCupon; 