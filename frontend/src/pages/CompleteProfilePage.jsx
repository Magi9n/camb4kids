import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';

const DOCUMENT_TYPES = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carnet de Extranjería' },
  { value: 'PTP', label: 'PTP' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

const SEX_OPTIONS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'O', label: 'Otros' },
];

const CompleteProfilePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [documentType, setDocumentType] = useState('DNI');
  const [document, setDocument] = useState('');
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [sex, setSex] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkProfileStatus } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      console.log('[DEBUG] Enviando datos del perfil:', {
        email,
        documentType,
        document,
        name,
        lastname,
        sex,
        phone,
      });
      
      await api.post('/auth/complete-profile', {
        email,
        documentType,
        document,
        name,
        lastname,
        sex,
        phone,
      });
      
      console.log('[DEBUG] Perfil completado exitosamente, verificando estado...');
      
      // Actualizar el estado del perfil en el contexto
      const isComplete = await checkProfileStatus();
      console.log('[DEBUG] Estado del perfil después de completar:', isComplete);
      
      setSuccess('¡Perfil completado exitosamente! Redirigiendo al dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('[DEBUG] Error al completar perfil:', err);
      setError(err.response?.data?.message || 'Error al guardar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
      <Paper sx={{ p: 4, minWidth: 350, maxWidth: 420 }} elevation={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ¡Tu cuenta ha sido creada!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Ahora deberás completar tu información para poder acceder y comenzar a cambiar.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              select
              label="Tipo de doc."
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              sx={{ minWidth: 140 }}
              required
            >
              {DOCUMENT_TYPES.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Número de doc."
              value={document}
              onChange={e => setDocument(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
              required
              fullWidth
            />
          </Box>
          <TextField
            label="Nombre(s)"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Apellido(s)"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Selecciona tu sexo"
            value={sex}
            onChange={e => setSex(e.target.value)}
            fullWidth
            margin="normal"
            required
          >
            {SEX_OPTIONS.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
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
            Completar
          </Button>
        </form>
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/')}
        >
          Volver Al Inicio
        </Button>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          <a href="#" style={{ color: '#4cafaa', textDecoration: 'underline' }}>¿Por qué me piden estos datos?</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default CompleteProfilePage; 