import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Fade } from 'react-awesome-reveal';
import LOGOMANGOCASHPARADO from '../assets/images/LOGOMANGOCASHPARADO.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/panel');
      }
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  const leftTexts = [
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972510.png',
      title: 'Gestión de Pagos',
      desc: 'Administra tus pagos de manera eficiente y segura. Acepta pagos en línea de forma rápida y confiable.',
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972510.png',
      title: 'Seguridad',
      desc: 'Nuestro sistema de seguridad está diseñado para proteger tus datos y transacciones financieras.',
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972510.png',
      title: 'Transparencia',
      desc: 'Mantén un registro detallado de todas tus transacciones financieras para un mejor control.',
    },
  ];

  const [show, setShow] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', height: '100vh', width: '100vw', display: 'flex', fontFamily: 'Roboto, sans-serif', background: '#F6F6F9', overflow: 'hidden' }}>
      {/* Bloque izquierdo */}
      <Fade in={show} timeout={900} style={{ transitionDelay: show ? '100ms' : '0ms' }}>
        <Box sx={{
          flex: 1.1,
          minWidth: 380,
          maxWidth: 600,
          bgcolor: '#BAFFD7',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 12,
          height: '100vh',
          boxShadow: '8px 0 32px 0 rgba(0,0,0,0.04)',
          animation: show ? 'slideInLeft 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          position: 'relative',
          zIndex: 2,
        }}>
          <img src={LOGOMANGOCASHPARADO} alt="MangosCash" style={{ width: 200, marginBottom: 48, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
          {leftTexts.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 7, width: '100%' }}>
              <img src={item.icon} alt="icono" style={{ width: 80, height: 80, marginRight: 32, flexShrink: 0 }} />
              <Box sx={{ textAlign: 'left', width: '100%' }}>
                <Typography sx={{ color: '#222', fontWeight: 700, fontSize: 24, mb: 1, letterSpacing: 0.2, textAlign: 'left', fontFamily: 'Play, sans-serif' }}>{item.title}</Typography>
                <Typography sx={{ color: '#222', fontWeight: 400, fontSize: 18, lineHeight: 1.4, textAlign: 'left', fontFamily: 'Play, sans-serif' }}>{item.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Fade>
      {/* Bloque derecho */}
      <Fade in={show} timeout={900} style={{ transitionDelay: show ? '300ms' : '0ms' }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 12,
          height: '100vh',
          boxShadow: '8px 0 32px 0 rgba(0,0,0,0.04)',
          animation: show ? 'slideInRight 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          position: 'relative',
          zIndex: 1,
        }}>
          <Paper sx={{ p: 4, minWidth: 320 }} elevation={3}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>Iniciar sesión</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
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
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Ingresar
              </Button>
            </form>
          </Paper>
        </Box>
      </Fade>
    </Box>
  );
};

export default LoginPage; 
 