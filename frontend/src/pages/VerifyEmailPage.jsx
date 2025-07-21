import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code });
      setSuccess('¡Correo verificado!');
      setTimeout(() => navigate('/complete-profile?email=' + encodeURIComponent(email)), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto o expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Paper sx={{ p: 4, minWidth: 320 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Verificar correo</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Ingresa el código que recibiste en <b>{email}</b>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Código de verificación"
            value={code}
            onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            Verificar
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default VerifyEmailPage; 