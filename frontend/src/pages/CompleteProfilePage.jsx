import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const CompleteProfilePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [phone, setPhone] = useState('');
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
      await api.post('/auth/complete-profile', { email, name, document, phone });
      setSuccess('¡Perfil completado! Ya puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Paper sx={{ p: 4, minWidth: 320 }} elevation={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Completar perfil</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Completa tus datos para activar tu cuenta.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Documento de identidad"
            value={document}
            onChange={e => setDocument(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Teléfono"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/[^0-9+]/g, ''))}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            Guardar perfil
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CompleteProfilePage; 