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
        width: '100%',
        minHeight: isMobile ? 160 : 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 4 },
        background: `linear-gradient(90deg, #23FFBD 0%, #F8F4DD 100%)`,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        mt: 3,
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
          opacity: 0.25,
        }}
      />
      {/* Contenido */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h5" sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 400 }}>
          Usa el cupon
        </Typography>
        <Typography variant="h3" sx={{ color: 'white', fontFamily: 'Open Sans, sans-serif', fontWeight: 700, mt: 1, mb: 0 }}>
          &gt; Dolero23
        </Typography>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 1, ml: { xs: 1, md: 4 } }}>
        <Button
          sx={{
            background: 'black',
            borderRadius: 6,
            px: { xs: 4, md: 8 },
            py: { xs: 1.5, md: 2 },
            fontSize: { xs: 24, md: 38 },
            fontFamily: 'Bangers, Impact, Arial Black, sans-serif',
            color: 'white',
            fontWeight: 700,
            boxShadow: `0 0 16px 2px ${neonColor}, 0 0 32px 4px rgba(0,0,0,0.2)`,
            textShadow: `0 0 8px ${neonColor}, 0 0 16px ${neonColor}`,
            letterSpacing: 2,
            transition: 'box-shadow 0.2s',
            '&:hover': {
              boxShadow: `0 0 32px 8px ${neonColor}, 0 0 32px 8px rgba(0,0,0,0.3)`
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