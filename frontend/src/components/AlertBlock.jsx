import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AlertBlock = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, token } = useAuth();
  const [buyValue, setBuyValue] = useState('');
  const [sellValue, setSellValue] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);

  React.useEffect(() => {
    api.get('/rates/current').then(res => setCurrentRate(res.data.rate)).catch(() => {});
  }, []);

  const validate = () => {
    if (!buyValue && !sellValue) return 'Debes ingresar al menos un valor.';
    if (buyValue && currentRate && parseFloat(buyValue) <= currentRate) return 'El valor de compra debe ser mayor al precio actual.';
    if (sellValue && currentRate && parseFloat(sellValue) >= currentRate) return 'El valor de venta debe ser menor al precio actual.';
    return '';
  };

  const showLoginModal = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setModalContent({
      title: 'Inicia sesión',
      message: 'Debes iniciar sesión para crear una alerta. Por favor, inicia sesión para continuar.'
    });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    console.log('handleCreate called. user:', user, 'token:', token);
    setError('');
    const err = validate();
    if (err) {
      console.log('Validation error:', err);
      return setError(err);
    }
    if (!token || !user) {
      console.log('No session detected, showing login modal.');
      showLoginModal();
      return;
    }
    setLoading(true);
    try {
      let created = false;
      if (buyValue) {
        await api.post('/alerts', { type: 'buy', value: parseFloat(buyValue) });
        created = true;
      }
      if (sellValue) {
        await api.post('/alerts', { type: 'sell', value: parseFloat(sellValue) });
        created = true;
      }
      if (created) {
        setModalContent({
          title: '¡Alerta creada!',
          message: `Te avisaremos al correo ${user.email} cuando la compra supere ${buyValue || '...'} o la venta baje de ${sellValue || '...'}.`,
        });
        setModalOpen(true);
        setBuyValue('');
        setSellValue('');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error al crear la alerta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#060e23', py: 7, px: { xs: 2, md: 8 }, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 4, mt: 0 }}>
      <Box sx={{ flex: 1, textAlign: 'center', color: 'white', fontFamily: 'Roboto, sans-serif', mb: isMobile ? 2 : 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, mb: 1 }}>
          Alertar cuando la Compra del dólar esté por encima de
        </Typography>
        <TextField
          value={buyValue}
          onChange={e => setBuyValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
          placeholder="Ej: 3.229"
          sx={{ bgcolor: 'white', borderRadius: 3, width: 140, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif' } }}
          inputProps={{ maxLength: 7 }}
        />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center', color: 'white', fontFamily: 'Roboto, sans-serif', mb: isMobile ? 2 : 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, mb: 1 }}>
          Alertar cuando la Venta del dólar esté por debajo de
        </Typography>
        <TextField
          value={sellValue}
          onChange={e => setSellValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
          placeholder="Ej: 3.229"
          sx={{ bgcolor: 'white', borderRadius: 3, width: 140, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif' } }}
          inputProps={{ maxLength: 7 }}
        />
      </Box>
      <form style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }} onSubmit={handleCreate} autoComplete="off">
        <Button
          variant="contained"
          sx={{
            bgcolor: '#23ffbd',
            color: '#060e23',
            fontWeight: 700,
            fontSize: 32,
            borderRadius: 999,
            px: 6,
            py: 2,
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
            textTransform: 'none',
            fontFamily: 'Roboto, sans-serif',
            '&:hover': { bgcolor: '#1be3a2' },
            mb: 1
          }}
          size="large"
          type="submit"
          disabled={loading || (!buyValue && !sellValue) || !token || !user}
        >
          Crear alerta
        </Button>
        <Typography sx={{ color: 'white', fontSize: 15, fontFamily: 'Roboto, sans-serif', mt: 0 }}>
          *Tienes que iniciar sesión
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </form>
      <Dialog
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setModalOpen(false)}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 320, textAlign: 'center' } }}
        BackdropProps={{ sx: { background: 'rgba(0,0,0,0.35)' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 28, fontFamily: 'Roboto, sans-serif', color: '#057c39' }}>{modalContent.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 18, fontFamily: 'Roboto, sans-serif', color: '#222' }}>{modalContent.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setModalOpen(false)} variant="contained" sx={{ bgcolor: '#057c39', color: 'white', borderRadius: 999, px: 4, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 18 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertBlock; 