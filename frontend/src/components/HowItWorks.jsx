import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import celular1 from '../assets/celular1.webp';
import celular2 from '../assets/celular2.webp';

// Importar Kollektif desde Google Fonts si no está en el proyecto
const KollektifFont = () => (
  <style>{`
    @import url('https://fonts.cdnfonts.com/css/kollektif');
    .kollektif { font-family: 'Kollektif', Arial, sans-serif; }
  `}</style>
);

const HowItWorks = () => (
  <Box sx={{ bgcolor: '#f7f7f7', width: '100%', py: 7, px: { xs: 2, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <KollektifFont />
    <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#057c39', fontWeight: 700, fontSize: 38, mb: 6, textAlign: 'center' }}>
      ¿Cómo Funciona?
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'flex-start', gap: { xs: 6, md: 10 }, width: '100%', maxWidth: 1100 }}>
      {/* Paso 1 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220, position: 'relative', height: 320 }}>
        <Box sx={{ position: 'absolute', top: 8, left: 18, zIndex: 2 }}>
          <span className="kollektif" style={{ fontSize: 70, color: '#000', fontWeight: 700, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}>1</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, width: '100%', mt: 2, pb: 3 }}>
          <img src={celular1} alt="Celular 1" style={{ height: 300, objectFit: 'contain' }} />
        </Box>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#057c39', fontWeight: 700, fontSize: 22, mb: 1, textAlign: 'center' }}>
          Cotiza tu cambio
        </Typography>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#222', fontSize: 16, textAlign: 'center', maxWidth: 220 }}>
          Ingresa el monto que vas a cambiar y cotiza tu cambio.
        </Typography>
      </Box>
      {/* Paso 2 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220, position: 'relative', height: 320 }}>
        <Box sx={{ position: 'absolute', top: 8, left: -18, zIndex: 2 }}>
          <span className="kollektif" style={{ fontSize: 70, color: '#000', fontWeight: 700, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}>2</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, width: '100%', mt: 2, pb: 3 }}>
          <img src={celular2} alt="Celular 2" style={{ height: 300, objectFit: 'contain' }} />
        </Box>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#057c39', fontWeight: 700, fontSize: 22, mb: 1, textAlign: 'center' }}>
          Transfiere
        </Typography>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#222', fontSize: 16, textAlign: 'center', maxWidth: 220 }}>
          Registra la cuenta destino, transfiere el monto a la cuenta.
        </Typography>
      </Box>
      {/* Paso 3 */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220, position: 'relative', height: 320 }}>
        <Box sx={{ position: 'absolute', top: 8, left: 18, zIndex: 2 }}>
          <span className="kollektif" style={{ fontSize: 70, color: '#000', fontWeight: 700, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}>3</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, width: '100%', mt: 2, pb: 3 }}>
          <DotLottieReact
            src="https://lottie.host/c33fd0da-5f5a-4d83-9949-c39fffda0280/2qCo4p6Mhx.lottie"
            loop
            autoplay
            style={{ height: 300, width: 200 }}
          />
        </Box>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#057c39', fontWeight: 700, fontSize: 22, mb: 1, textAlign: 'center' }}>
          Recibe tu cambio
        </Typography>
        <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#222', fontSize: 16, textAlign: 'center', maxWidth: 220 }}>
          Verifica tu operación y recibe tu cambio en tu cuenta.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default HowItWorks; 