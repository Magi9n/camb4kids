import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../services/api';

const ForgotPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
      const response = await api.post('/auth/forgot-password', { email });
      setShowSuccessModal(true);
      setEmail('');
    } catch (error) {
      console.error('Error al enviar solicitud de recuperación:', error);
      // Aún mostramos el modal de éxito para evitar enumeración de usuarios
      setShowSuccessModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    setLoading(false);
    onClose();
  };

  return (
    <>
      {/* Modal principal de recuperación */}
      <Dialog 
        open={open} 
        onClose={handleClose}
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
          Recuperar Contraseña
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#222', 
            fontSize: 16, 
            textAlign: 'center',
            lineHeight: 1.6,
            mb: 3
          }}>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </Typography>
          
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
                mb: 2,
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
                mb: 2,
                textAlign: 'center',
                bgcolor: 'transparent'
              }}>
                {emailError}
              </Typography>
            )}
            
            <Button
              variant="contained"
              sx={{ 
                bgcolor: '#057c39', 
                color: 'white', 
                fontWeight: 700, 
                py: 1.5, 
                px: 4,
                borderRadius: 2, 
                fontFamily: 'Play, sans-serif', 
                fontSize: 16, 
                textTransform: 'none',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.15)',
                width: '50%',
                '&:hover': {
                  bgcolor: '#046a30',
                  boxShadow: '0 4px 12px 0 rgba(0,0,0,0.2)',
                }
              }}
              disabled={loading || !email || !!emailError}
              onClick={handleSubmit}
            >
              {loading ? 'Enviando...' : 'Enviar Correo'}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              borderColor: '#057c39',
              color: '#057c39', 
              fontWeight: 700, 
              px: 4, 
              py: 1, 
              borderRadius: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 16,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#046a30',
                color: '#046a30',
                bgcolor: 'rgba(5, 124, 57, 0.04)',
              }
            }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación */}
      <Dialog 
        open={showSuccessModal} 
        onClose={handleCloseSuccessModal}
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
          ¡Correo Enviado!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#222', 
            fontSize: 16, 
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Si el correo ingresado existe en nuestra base de datos, recibirás un enlace de recuperación 
            en los próximos minutos. Revisa tu bandeja de entrada y carpeta de spam.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            onClick={handleCloseSuccessModal}
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
    </>
  );
};

export default ForgotPasswordModal; 