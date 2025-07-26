import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LOGOMANGOCASHPARADO from '../assets/LOGOMANGOCASHPARADO.svg';
import Fade from '@mui/material/Fade';
import { FaCalculator, FaExchangeAlt, FaMoneyCheckAlt } from 'react-icons/fa';

const leftTexts = [
  {
    icon: FaCalculator,
    title: 'Calcula tu cambio',
    desc: <>
      Utiliza nuestra calculadora para conocer el <span style={{ color: '#057c39', fontWeight: 700 }}>tipo de cambio</span> en tiempo real y tomar la mejor decisión.
    </>,
  },
  {
    icon: FaExchangeAlt,
    title: 'Transfiere con seguridad',
    desc: <>
      Envía tu <span style={{ color: '#057c39', fontWeight: 700 }}>dinero</span> desde tu banco favorito y nosotros nos encargamos del resto.
    </>,
  },
  {
    icon: FaMoneyCheckAlt,
    title: 'Recibe tu cambio',
    desc: <>
      El monto cambiado será <span style={{ color: '#057c39', fontWeight: 700 }}>depositado</span> en tu cuenta de destino de forma rápida y segura.
    </>,
  },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

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

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', fontFamily: 'Roboto, sans-serif', background: '#F6F6F9' }}>
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
          px: 6,
          py: 8,
          boxShadow: '8px 0 32px 0 rgba(0,0,0,0.04)',
          animation: show ? 'slideInLeft 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          position: 'relative',
          zIndex: 2
        }}>
          <img src={LOGOMANGOCASHPARADO} alt="MangosCash" style={{ width: 120, marginBottom: 32 }} />
          {leftTexts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', mb: 5, width: '100%' }}>
                <Box sx={{ bgcolor: '#057c39', borderRadius: 2, p: 1, display: 'flex', alignItems: 'center', minWidth: 48, minHeight: 48, mr: 2 }}>
                  <Icon size={32} color="#fff" style={{ marginRight: 16 }} />
                </Box>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 20, mb: 0.5, letterSpacing: 0.2 }}>{item.title}</Typography>
                  <Typography sx={{ color: '#fff', fontWeight: 400, fontSize: 16, lineHeight: 1.4 }}>{item.desc}</Typography>
                </Box>
              </Box>
            );
          })}
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
          px: 6,
          py: 8,
          boxShadow: '8px 0 32px 0 rgba(0,0,0,0.04)',
          animation: show ? 'slideInRight 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          position: 'relative',
          zIndex: 2
        }}>
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
        </Box>
      </Fade>
    </Box>
  );
};

export default LoginPage; 
 