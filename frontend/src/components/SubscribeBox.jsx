import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import monedaesquina from '../assets/monedaesquina.png';
import monedaparada from '../assets/monedaparada.png';

const SubscribeBox = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      setEmailError('Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setShowModal(true);
        setEmail('');
      } else {
        const error = await response.json();
        if (response.status === 409) {
          // Error de suscripción duplicada
          setShowDuplicateModal(true);
        } else {
          alert(error.message || 'Error al suscribirse');
        }
      }
    } catch (error) {
      alert('Error de conexión. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      bgcolor: 'white', 
      py: 8, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Imagen de moneda en esquina inferior izquierda */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        zIndex: 1
      }}>
        <img src={monedaesquina} alt="Moneda esquina" style={{ width: 280, height: 'auto' }} />
      </Box>

      {/* Imagen de moneda en esquina superior derecha */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1
      }}>
        <img src={monedaparada} alt="Moneda parada" style={{ width: 250, height: 'auto' }} />
      </Box>

      {/* Contenido principal */}
      <Box sx={{
        bgcolor: 'rgba(198, 255, 209, 0.7)',
        borderRadius: 4,
        px: 6,
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        maxWidth: 450,
        width: '90%',
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{ 
          fontFamily: 'Roboto, sans-serif', 
          color: '#000', 
          fontWeight: 700, 
          fontSize: 36, 
          mb: 3, 
          textAlign: 'left', 
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>
          SUSCRÍBETE
        </Typography>

        <Typography sx={{ 
          fontFamily: 'Roboto, sans-serif', 
          color: '#000', 
          fontSize: 20, 
          textAlign: 'left', 
          mb: 5,
          maxWidth: 400
        }}>
          Recibe notificaciones cada semana en tu correo.
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          width: '100%', 
          alignItems: 'center'
        }}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              error={!!emailError}
              sx={{ 
                bgcolor: '#fcf9f9', 
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontFamily: 'Roboto, sans-serif',
                  textAlign: 'center',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover fieldset': {
                    border: 'none',
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none',
                  },
                  '& input': {
                    textAlign: 'center',
                    fontFamily: 'Roboto, sans-serif',
                  },
                  '& input::placeholder': {
                    textAlign: 'center',
                    fontFamily: 'Roboto, sans-serif',
                  }
                }
              }}
            />
            {emailError && (
              <Typography sx={{ 
                color: '#d32f2f',
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                mt: 1,
                textAlign: 'center',
                bgcolor: 'transparent'
              }}>
                {emailError}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: '#057c39', 
              color: 'white', 
              fontWeight: 700, 
              py: 2, 
              px: 6,
              borderRadius: 2, 
              fontFamily: 'Play, sans-serif', 
              fontSize: 22, 
              textTransform: 'none',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
              width: '60%',
              '&:hover': {
                bgcolor: '#046a30',
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.2)',
              }
            }}
            disabled={loading || !email || !!emailError}
            onClick={handleSubmit}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </Box>
      </Box>

      {/* Modal de confirmación */}
      <Dialog 
        open={showModal} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Roboto, sans-serif', 
          color: '#057c39', 
          fontWeight: 700, 
          fontSize: 24, 
          textAlign: 'center',
          pb: 1
        }}>
          ¡Suscripción Exitosa!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#222', 
            fontSize: 16, 
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Tu suscripción ha sido registrada exitosamente. A partir de ahora recibirás todas nuestras actualizaciones, 
            noticias sobre el tipo de cambio y ofertas especiales directamente en tu correo electrónico.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{ 
              bgcolor: '#057c39', 
              color: 'white', 
              fontWeight: 700, 
              px: 4, 
              py: 1, 
              borderRadius: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 16,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#046a30',
              }
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de suscripción duplicada */}
      <Dialog 
        open={showDuplicateModal} 
        onClose={handleCloseDuplicateModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Roboto, sans-serif', 
          color: '#057c39', 
          fontWeight: 700, 
          fontSize: 24, 
          textAlign: 'center',
          pb: 1
        }}>
          ¡Ya estás suscrito!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#222', 
            fontSize: 16, 
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Ya tienes una suscripción activa con este correo electrónico. No te preocupes, 
            seguirás recibiendo todas nuestras actualizaciones y noticias importantes sobre el tipo de cambio.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            onClick={handleCloseDuplicateModal}
            variant="contained"
            sx={{ 
              bgcolor: '#057c39', 
              color: 'white', 
              fontWeight: 700, 
              px: 4, 
              py: 1, 
              borderRadius: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 16,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#046a30',
              }
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscribeBox; 