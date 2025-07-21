import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      setSuccess('¡Registro exitoso! Revisa tu correo para el código de verificación.');
      setTimeout(() => navigate('/verify-email?email=' + encodeURIComponent(email)), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar.');
    } finally {
      setLoading(false);
    }
  };

  // Simulación de login con Google (dejar preparado el flujo)
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google'; // El backend debe implementar esta ruta
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Paper sx={{ p: 4, minWidth: 320 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Crear cuenta</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            Registrarse
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>o</Divider>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
        >
          Registrarse con Google
        </Button>
        <Button
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Paper>
    </Box>
  );
};

export default RegisterPage; 