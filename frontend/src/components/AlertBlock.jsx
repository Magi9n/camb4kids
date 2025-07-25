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

  const handleCreate = async () => {
    setError('');
    const err = validate();
    if (err) return setError(err);
    if (!token || !user) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setModalContent({
        title: 'Inicia sesión',
        message: 'Debes iniciar sesión para crear una alerta. Por favor, inicia sesión para continuar.'
      });
      setModalOpen(true);
      return;
    }
    // Solo si está logueado continúa
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
    <Box sx={{ bgcolor: '#060e23', py: 3, px: { xs: 1, md: 3 }, width: '100vw', minWidth: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 3, mt: 0, mx: 0 }}>
      <Box sx={{ flex: 1, textAlign: 'center', color: 'white', fontFamily: 'Roboto, sans-serif', mb: isMobile ? 2 : 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, mb: 1 }}>
          Alertar cuando la Compra del dólar esté por encima de
        </Typography>
        <TextField
          value={buyValue}
          onChange={e => {
            let val = e.target.value.replace(/[^0-9.]/g, '');
            // Solo permitir 1 entero y hasta 2 decimales
            val = val.replace(/^(\d)(\d+)/, '$1'); // Solo 1 entero
            val = val.replace(/(\..{0,2}).*$/, '$1'); // Máximo 2 decimales
            setBuyValue(val);
          }}
          placeholder="Ej: 9.12"
          sx={{ bgcolor: 'white', borderRadius: 2, width: 90, input: { textAlign: 'center', fontSize: 18, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1 } }}
          inputProps={{ maxLength: 5 }}
        />
      </Box>
      <Box sx={{ flex: 1, textAlign: 'center', color: 'white', fontFamily: 'Roboto, sans-serif', mb: isMobile ? 2 : 0 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 400, mb: 1 }}>
          Alertar cuando la Venta del dólar esté por debajo de
        </Typography>
        <TextField
          value={sellValue}
          onChange={e => {
            let val = e.target.value.replace(/[^0-9.]/g, '');
            // Solo permitir 1 entero y hasta 2 decimales
            val = val.replace(/^(\d)(\d+)/, '$1'); // Solo 1 entero
            val = val.replace(/(\..{0,2}).*$/, '$1'); // Máximo 2 decimales
            setSellValue(val);
          }}
          placeholder="Ej: 9.12"
          sx={{ bgcolor: 'white', borderRadius: 2, width: 90, input: { textAlign: 'center', fontSize: 18, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1 } }}
          inputProps={{ maxLength: 5 }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
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
          onClick={handleCreate}
          disabled={loading || (!buyValue && !sellValue)}
        >
          Crear alerta
        </Button>
        <Typography sx={{ color: 'white', fontSize: 15, fontFamily: 'Roboto, sans-serif', mt: 0 }}>
          *Tienes que iniciar sesión
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </Box>
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