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
        maxWidth: '100%',
        minHeight: isMobile ? 80 : 70,
        height: isMobile ? 90 : 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        py: 0,
        background: `linear-gradient(90deg, #23FFBD 0%, #F8F4DD 100%)`,
        borderRadius: 0,
        position: 'relative',
        overflow: 'hidden',
        mt: 0,
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
          background: `url(${bgCupon}) center/cover no-repeat`,
          opacity: 0.18,
          filter: 'blur(0.5px)',
        }}
      />
      {/* Contenido */}
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: { xs: 0, md: 2 } }}>
        <Typography variant="h6" sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 400, lineHeight: 1, fontSize: { xs: 18, md: 26 } }}>
          Usa el cupon
        </Typography>
        <Typography variant="h3" sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 700, mt: 0.5, mb: 0, lineHeight: 1, fontSize: { xs: 28, md: 38 } }}>
          &gt; Dolero23
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, ml: { xs: 1, md: 3 }, display: 'flex', alignItems: 'center', height: '100%' }}>
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
  );
};

export default BannerCupon; 