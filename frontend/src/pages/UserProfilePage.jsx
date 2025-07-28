import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

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

const UserProfilePage = () => {
  const { user, checkProfileStatus } = useAuth();
  const navigate = useNavigate();
  
  // Estados del formulario
  const [documentType, setDocumentType] = useState(user?.documentType || 'DNI');
  const [document, setDocument] = useState(user?.document || '');
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [sex, setSex] = useState(user?.sex || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Estados para el cambio de email
  const [newEmail, setNewEmail] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  // Estados de UI
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await api.get('/auth/profile');
        const userData = response.data;
        setDocumentType(userData.documentType || 'DNI');
        setDocument(userData.document || '');
        setName(userData.name || '');
        setLastname(userData.lastname || '');
        setSex(userData.sex || '');
        setPhone(userData.phone || '');
        setEmail(userData.email || '');
      } catch (error) {
        console.error('Error cargando datos del usuario:', error);
      }
    };
    
    loadUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      await api.put('/auth/profile', {
        documentType,
        document,
        name,
        lastname,
        sex,
        phone,
      });
      
      // Actualizar el estado del perfil en el contexto
      await checkProfileStatus();
      
      setSuccess('¡Perfil actualizado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = () => {
    if (!newEmail || newEmail === email) {
      setError('Ingresa un nuevo correo electrónico diferente al actual.');
      return;
    }
    
    setPendingEmail(newEmail);
    setShowEmailDialog(true);
  };

  const confirmEmailChange = async () => {
    setEmailLoading(true);
    setError('');
    
    try {
      await api.post('/auth/change-email', { newEmail: pendingEmail });
      setShowEmailDialog(false);
      setShowVerificationDialog(true);
      setSuccess('Se ha enviado un código de verificación a tu nuevo correo electrónico.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al solicitar el cambio de correo.');
    } finally {
      setEmailLoading(false);
    }
  };

  const verifyNewEmail = async () => {
    if (!emailVerificationCode) {
      setError('Ingresa el código de verificación.');
      return;
    }
    
    setEmailLoading(true);
    setError('');
    
    try {
      await api.post('/auth/verify-new-email', {
        newEmail: pendingEmail,
        code: emailVerificationCode
      });
      
      setShowVerificationDialog(false);
      setEmail(pendingEmail);
      setNewEmail('');
      setEmailVerificationCode('');
      setPendingEmail('');
      setSuccess('¡Correo electrónico actualizado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Código de verificación incorrecto.');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', p: 2 }}>
      <Paper sx={{ p: 4, minWidth: 350, maxWidth: 420 }} elevation={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Mi Perfil
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Actualiza tu información personal. Los campos marcados con * no se pueden modificar.
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
              disabled
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
              disabled
            />
          </Box>
          
          <TextField
            label="Nombre(s)"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled
          />
          
          <TextField
            label="Apellido(s)"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled
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
          
          <TextField
            label="Correo electrónico actual"
            value={email}
            fullWidth
            margin="normal"
            disabled
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              label="Nuevo correo electrónico"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              fullWidth
              type="email"
            />
            <Button
              variant="outlined"
              onClick={handleEmailChange}
              sx={{ minWidth: 120 }}
            >
              Cambiar
            </Button>
          </Box>
          
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          {success && <Typography color="success.main" sx={{ mt: 1 }}>{success}</Typography>}
          
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar Perfil'}
          </Button>
        </form>
        
        <Button
          variant="outlined"
          color="inherit"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate('/dashboard')}
        >
          Volver al Dashboard
        </Button>
      </Paper>

      {/* Dialog para confirmar cambio de email */}
      <Dialog open={showEmailDialog} onClose={() => setShowEmailDialog(false)}>
        <DialogTitle>Confirmar cambio de correo</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres cambiar tu correo electrónico de <strong>{email}</strong> a <strong>{pendingEmail}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Se enviará un código de verificación al nuevo correo. Tienes 15 minutos para verificar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)}>Cancelar</Button>
          <Button onClick={confirmEmailChange} variant="contained" disabled={emailLoading}>
            {emailLoading ? 'Enviando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para verificar nuevo email */}
      <Dialog open={showVerificationDialog} onClose={() => setShowVerificationDialog(false)}>
        <DialogTitle>Verificar nuevo correo</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Se ha enviado un código de verificación a <strong>{pendingEmail}</strong>
          </Typography>
          <TextField
            label="Código de verificación"
            value={emailVerificationCode}
            onChange={e => setEmailVerificationCode(e.target.value)}
            fullWidth
            placeholder="Ingresa el código de 4 dígitos"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVerificationDialog(false)}>Cancelar</Button>
          <Button onClick={verifyNewEmail} variant="contained" disabled={emailLoading}>
            {emailLoading ? 'Verificando...' : 'Verificar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfilePage; 