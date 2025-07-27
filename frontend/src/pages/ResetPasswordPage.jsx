import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../services/api';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Verificar si el token es válido
    const verifyToken = async () => {
      try {
        const response = await api.get(`/auth/verify-reset-token?token=${token}`);
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (error) {
        setTokenValid(false);
      } finally {
        setTokenLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      setErrors({ general: 'Error al restablecer la contraseña. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  if (tokenLoading) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F6F6F9',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <Typography sx={{ color: '#222', fontSize: 18 }}>
          Verificando enlace...
        </Typography>
      </Box>
    );
  }

  if (!tokenValid) {
    return (
      <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F6F6F9',
        fontFamily: 'Roboto, sans-serif'
      }}>
        <Box sx={{
          bgcolor: 'white',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <Typography sx={{ color: '#d32f2f', fontSize: 20, fontWeight: 700, mb: 2 }}>
            Enlace Inválido
          </Typography>
          <Typography sx={{ color: '#666', fontSize: 16, mb: 3 }}>
            El enlace de recuperación ha expirado o es inválido. 
            Solicita un nuevo enlace desde la página de inicio de sesión.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: '#057c39',
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 16,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#046a30',
              }
            }}
          >
            Ir al Login
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#F6F6F9',
      fontFamily: 'Roboto, sans-serif'
    }}>
      <Box sx={{
        bgcolor: 'white',
        p: 4,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: 400,
        width: '90%'
      }}>
        <Typography sx={{ color: '#222', fontSize: 24, fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Restablecer Contraseña
        </Typography>
        <Typography sx={{ color: '#666', fontSize: 16, mb: 4, textAlign: 'center' }}>
          Ingresa tu nueva contraseña
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nueva Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.password}
            helperText={errors.password}
            placeholder="Mínimo 6 caracteres"
            InputProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
            InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
          />
          
          <TextField
            label="Confirmar Contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            placeholder="Repite tu contraseña"
            InputProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
            InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif' } }}
          />

          {errors.general && (
            <Typography sx={{ color: '#d32f2f', fontSize: 14, mt: 1, textAlign: 'center' }}>
              {errors.general}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              bgcolor: '#057c39',
              color: 'white',
              fontWeight: 700,
              py: 1.5,
              borderRadius: 2,
              fontFamily: 'Roboto, sans-serif',
              fontSize: 16,
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#046a30',
              }
            }}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate('/login')}
          sx={{
            mt: 2,
            borderColor: '#057c39',
            color: '#057c39',
            fontWeight: 700,
            py: 1.5,
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
      </Box>

      {/* Modal de éxito */}
      <Dialog 
        open={showSuccessModal} 
        onClose={handleSuccessModalClose}
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
          ¡Contraseña Actualizada!
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            color: '#222', 
            fontSize: 16, 
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <Button
            onClick={handleSuccessModalClose}
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
            Ir al Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResetPasswordPage; 