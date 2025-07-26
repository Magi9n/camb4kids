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
import CalculadoraSVG from '../assets/CALCULADORA.svg';
import TransferenciaSVG from '../assets/transferencia.svg';
import RecibidoSVG from '../assets/recibido.svg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setShow(true), 100);
  }, []);

  // Definir los textos y SVGs aquí
  const leftTexts = [
    {
      icon: CalculadoraSVG,
      title: 'Calcula tu cambio',
      desc: React.createElement(React.Fragment, null, [
        'Utiliza nuestra calculadora para conocer el ',
        <span key="1" style={{ color: '#005a7c', fontWeight: 700 }}>tipo de cambio</span>,
        ' en tiempo real y tomar la mejor decisión.'
      ]),
    },
    {
      icon: TransferenciaSVG,
      title: 'Transfiere con seguridad',
      desc: React.createElement(React.Fragment, null, [
        'Envía tu ',
        <span key="2" style={{ color: '#005a7c', fontWeight: 700 }}>dinero</span>,
        ' desde tu banco favorito y nosotros nos encargamos del resto.'
      ]),
    },
    {
      icon: RecibidoSVG,
      title: 'Recibe tu cambio',
      desc: React.createElement(React.Fragment, null, [
        'El monto cambiado será ',
        <span key="3" style={{ color: '#005a7c', fontWeight: 700 }}>depositado</span>,
        ' en tu cuenta de destino de forma rápida y segura.'
      ]),
    },
  ];

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
                <Typography sx={{ color: '#222', fontWeight: 700, fontSize: 26, mb: 1, letterSpacing: 0.2, textAlign: 'left' }}>{item.title}</Typography>
                <Typography sx={{ color: '#222', fontWeight: 400, fontSize: 20, lineHeight: 1.4, textAlign: 'left' }}>{item.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Fade>
      {/* Bloque derecho */}
      <Fade in={show} timeout={900} style={{ transitionDelay: show ? '300ms' : '0ms' }}>
        <Box sx={{
          flex: 1,
          minWidth: 340,
          maxWidth: 480,
          bgcolor: '#F6F6F9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 6,
          height: '100vh',
          boxShadow: 'none',
          animation: show ? 'slideInRight 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          zIndex: 1
        }}>
          <Box sx={{ width: '100%', maxWidth: 370, mx: 'auto', p: 0, bgcolor: 'transparent', boxShadow: 'none', borderRadius: 0 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#222', fontFamily: 'Roboto, sans-serif', textAlign: 'left' }}>Inicia sesión</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Correo"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{ style: { fontFamily: 'Roboto, sans-serif', color: '#222', background: '#fff', borderRadius: 8, boxShadow: 'none' } }}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif', color: '#222' } }}
                sx={{ mb: 2, boxShadow: 'none', borderRadius: 2 }}
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                InputProps={{ style: { fontFamily: 'Roboto, sans-serif', color: '#222', background: '#fff', borderRadius: 8, boxShadow: 'none' } }}
                InputLabelProps={{ style: { fontFamily: 'Roboto, sans-serif', color: '#222' } }}
                sx={{ mb: 1, boxShadow: 'none', borderRadius: 2 }}
              />
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                <span
                  style={{
                    color: '#005a7c',
                    fontWeight: 500,
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 15,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                    transition: 'color 0.2s',
                  }}
                  onClick={() => navigate('/forgot-password')}
                  onMouseOver={e => e.target.style.color = '#00395a'}
                  onMouseOut={e => e.target.style.color = '#005a7c'}
                >
                  ¿Olvidaste tu contraseña?
                </span>
              </Box>
              {error && <Typography color="error" sx={{ mt: 1, fontFamily: 'Roboto, sans-serif' }}>{error}</Typography>}
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, mb: 1, py: 1.5, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 18, bgcolor: '#BAFFD7', color: '#222', boxShadow: 'none', borderRadius: 2, '&:hover': { bgcolor: '#a0e6c2' } }}>
                INICIAR SESIÓN
              </Button>
              <Typography sx={{ mt: 2, color: '#005a7c', fontFamily: 'Roboto, sans-serif', fontSize: 15, textAlign: 'center', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/register')}>
                ¿No tienes cuenta? Regístrate aquí
              </Typography>
            </form>
          </Box>
        </Box>
      </Fade>
      {/* Animaciones keyframes ... igual ... */}
    </Box>
  );
};

export default LoginPage; 
 