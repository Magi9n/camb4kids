import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';

const SubscribeBox = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <Box sx={{ width: '100%', bgcolor: '#f7f7f7', py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#057c39', fontWeight: 700, fontSize: 32, mb: 1, textAlign: 'center', letterSpacing: 2 }}>
        SUSCRÍBETE
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, width: { xs: '90%', sm: 420 }, maxWidth: 500, mt: 2 }}>
        <TextField
          fullWidth
          size="medium"
          variant="outlined"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={sent}
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: '#057c39', color: 'white', fontWeight: 700, px: 4, borderRadius: 2, fontFamily: 'Roboto, sans-serif', fontSize: 18, height: 48, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}
          disabled={sent || !email}
          onClick={() => setSent(true)}
        >
          {sent ? '¡Enviado!' : 'Enviar'}
        </Button>
      </Box>
      <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#222', fontSize: 15, textAlign: 'center', mt: 2 }}>
        Recibe notificaciones cada semana en tu correo.
      </Typography>
    </Box>
  );
};

export default SubscribeBox; 