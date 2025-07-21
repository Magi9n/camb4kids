import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Fade, Paper } from '@mui/material';

const SubscribeBox = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <Fade in timeout={1200}>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, bgcolor: '#f6fff6' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 4, minWidth: 320, maxWidth: 400 }}>
          <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
            SUSCRÍBETE
          </Typography>
          <Typography variant="body1" mb={2}>
            Recibe notificaciones cada semana en tu correo.
          </Typography>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={sent}
            />
            <Button
              variant="contained"
              color="success"
              disabled={sent || !email}
              onClick={() => setSent(true)}
              sx={{ minWidth: 100 }}
            >
              {sent ? '¡Enviado!' : 'Enviar'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default SubscribeBox; 