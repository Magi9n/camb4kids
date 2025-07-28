import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { user, checkProfileStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    lastname: '',
    documentType: '',
    document: '',
    sex: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/complete-profile', formData);
      setSuccess(true);
      
      // Verificar el estado del perfil
      await checkProfileStatus();
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error al completar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      p: 2
    }}>
      <Paper sx={{ 
        p: 4, 
        maxWidth: 500, 
        width: '100%', 
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            textAlign: 'center', 
            mb: 3, 
            color: '#057c39',
            fontWeight: 700,
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          Completar Perfil
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            mb: 4, 
            color: '#666',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          Para acceder al dashboard, necesitamos que completes tu información personal.
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Perfil completado exitosamente! Redirigiendo al dashboard...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Apellidos"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tipo de Documento</InputLabel>
            <Select
              name="documentType"
              value={formData.documentType}
              onChange={handleInputChange}
              required
              label="Tipo de Documento"
            >
              <MenuItem value="DNI">DNI</MenuItem>
              <MenuItem value="CE">Carné de Extranjería</MenuItem>
              <MenuItem value="PASSPORT">Pasaporte</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Número de Documento"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            required
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sexo</InputLabel>
            <Select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              required
              label="Sexo"
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Teléfono"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#057c39',
              color: 'white',
              py: 1.5,
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              '&:hover': {
                bgcolor: '#046a30'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Completar Perfil'
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CompleteProfilePage; 