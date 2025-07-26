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
    <Box sx={{ 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      fontFamily: 'Roboto, sans-serif', 
      background: '#F6F6F9',
      overflow: 'hidden'
    }}>
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
          px: 8,
          boxShadow: '-8px 0 32px 0 rgba(0,0,0,0.04)',
          animation: show ? 'slideInRight 1s cubic-bezier(.77,0,.18,1) forwards' : 'none',
          zIndex: 1
        }}>
          <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 4, color: '#222', fontFamily: 'Roboto, sans-serif', textAlign: 'left' }}>
              Inicia sesión
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Correo"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                placeholder="Escribe tu correo"
                InputProps={{ 
                  style: { 
                    fontFamily: 'Roboto, sans-serif', 
                    color: '#222',
                    backgroundColor: 'white',
                    borderRadius: 2
                  } 
                }}
                InputLabelProps={{ 
                  style: { 
                    fontFamily: 'Roboto, sans-serif', 
                    color: '#222' 
                  } 
                }}
              />
              <TextField
                label="Contraseña"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                placeholder="Escribe tu contraseña"
                InputProps={{ 
                  style: { 
                    fontFamily: 'Roboto, sans-serif', 
                    color: '#222',
                    backgroundColor: 'white',
                    borderRadius: 2
                  } 
                }}
                InputLabelProps={{ 
                  style: { 
                    fontFamily: 'Roboto, sans-serif', 
                    color: '#222' 
                  } 
                }}
              />
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Typography
                  sx={{
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
                  Olvidé mi contraseña
                </Typography>
              </Box>
              {error && <Typography color="error" sx={{ mt: 1, fontFamily: 'Roboto, sans-serif' }}>{error}</Typography>}
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 4, 
                  mb: 3, 
                  py: 1.5, 
                  fontWeight: 700, 
                  fontFamily: 'Roboto, sans-serif', 
                  fontSize: 18, 
                  bgcolor: '#57C9A6', 
                  color: '#fff', 
                  boxShadow: '0 2px 8px 0 rgba(87,201,166,0.12)', 
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  '&:hover': { bgcolor: '#3bbd8c' } 
                }}
              >
                Iniciar sesión
              </Button>
            </form>
            <Typography sx={{ mt: 2, color: '#222', fontFamily: 'Roboto, sans-serif', fontSize: 15, textAlign: 'center' }}>
              ¿No tienes cuenta?{' '}
              <span
                style={{
                  color: '#005a7c',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2,
                  transition: 'color 0.2s',
                }}
                onClick={() => navigate('/register')}
                onMouseOver={e => e.target.style.color = '#00395a'}
                onMouseOut={e => e.target.style.color = '#005a7c'}
              >
                Regístrate aquí
              </span>
            </Typography>
          </Box>
        </Box>
      </Fade>
      {/* Animaciones keyframes */}
      <style>{`
        @keyframes slideInLeft {
          0% { transform: translateX(-80vw); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(80vw); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default LoginPage; 
 