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

export const AlertForm = ({ onSuccess, initialBuy, initialSell, editing, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, token } = useAuth();
  const [buyValue, setBuyValue] = useState(initialBuy || '');
  const [sellValue, setSellValue] = useState(initialSell || '');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);

  React.useEffect(() => {
    const fetchRate = () => {
      api.get('/rates/current').then(res => setCurrentRate(res.data.rate)).catch(() => {});
    };
    
    // Cargar datos iniciales
    fetchRate();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchRate, 5000);
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
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
          title: editing ? '¡Alerta actualizada!' : '¡Alerta creada!',
          message: `Te avisaremos al correo ${user.email} cuando la compra supere ${buyValue || '...'} o la venta baje de ${sellValue || '...'}.`,
        });
        setModalOpen(true);
        setBuyValue('');
        setSellValue('');
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error al crear la alerta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 3, mt: 0, mx: 0 }}>
      <Box sx={{ flex: '0 0 auto', minWidth: 5, maxWidth: 220, textAlign: 'right', color: 'white', fontFamily: 'Roboto, sans-serif', pr: 0.1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, lineHeight: 1.1, wordBreak: 'break-word' }}>
          Quiero dólares, avísame cuando el dólar sea menor a:
        </Typography>
      </Box>
      <TextField
        value={buyValue}
        onChange={e => {
          let val = e.target.value.replace(/[^0-9.]/g, '');
          val = val.replace(/^([0-9]+\.[0-9]{0,3}).*$/, '$1');
          setBuyValue(val);
        }}
        placeholder="3.123"
        sx={{ bgcolor: 'white', borderRadius: 3, width: 140, mx: 2, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1.5 } }}
        inputProps={{ maxLength: 6 }}
      />
      <Box sx={{ flex: '0 0 auto', minWidth: 5, maxWidth: 220, textAlign: 'right', color: 'white', fontFamily: 'Roboto, sans-serif', pr: 0.1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, lineHeight: 1.1, wordBreak: 'break-word' }}>
          Tengo dólares, avísame cuando el dólar sea mayor a:
        </Typography>
      </Box>
      <TextField
        value={sellValue}
        onChange={e => {
          let val = e.target.value.replace(/[^0-9.]/g, '');
          val = val.replace(/^([0-9]+\.[0-9]{0,3}).*$/, '$1');
          setSellValue(val);
        }}
        placeholder="3.123"
        sx={{ bgcolor: 'white', borderRadius: 3, width: 140, mx: 2, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1.5 } }}
        inputProps={{ maxLength: 6 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 3 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#057c39',
            color: 'white',
            fontWeight: 700,
            fontSize: 20,
            borderRadius: 999,
            px: 4,
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            textTransform: 'none',
            fontFamily: 'Roboto, sans-serif',
            '&:hover': { bgcolor: '#046a30' },
            mb: 0.5
          }}
          size="medium"
          onClick={handleCreate}
          disabled={loading || (!buyValue && !sellValue)}
        >
          {editing ? 'Guardar cambios' : 'Crear alerta'}
        </Button>
        {onCancel && (
          <Button onClick={onCancel} sx={{ mt: 1, color: '#666' }}>Cancelar</Button>
        )}
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
    const fetchRate = () => {
      api.get('/rates/current').then(res => setCurrentRate(res.data.rate)).catch(() => {});
    };
    
    // Cargar datos iniciales
    fetchRate();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchRate, 5000);
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
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
    <Box sx={{ bgcolor: '#060e23', py: 3, px: { xs: 1, md: 3 }, width: '100vw', minWidth: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 3, mt: 0, mx: 0 }}>
      <Box sx={{ flex: '0 0 auto', minWidth: 5, maxWidth: 220, textAlign: 'right', color: 'white', fontFamily: 'Roboto, sans-serif', pr: 0.1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, lineHeight: 1.1, wordBreak: 'break-word' }}>
          Alertar cuando la Compra del dólar esté por encima de
        </Typography>
      </Box>
      <TextField
        value={buyValue}
        onChange={e => {
          let val = e.target.value.replace(/[^0-9.]/g, '');
          val = val.replace(/^(\d)(\d+)/, '$1');
          val = val.replace(/(\..{0,2}).*$/, '$1');
          setBuyValue(val);
        }}
        placeholder="3.12"
        sx={{ bgcolor: 'white', borderRadius: 3, width: 140, mx: 2, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1.5 } }}
        inputProps={{ maxLength: 5 }}
      />
      <Box sx={{ flex: '0 0 auto', minWidth: 5, maxWidth: 220, textAlign: 'right', color: 'white', fontFamily: 'Roboto, sans-serif', pr: 0.1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 400, lineHeight: 1.1, wordBreak: 'break-word' }}>
          Alertar cuando la Venta del dólar esté por debajo de
        </Typography>
      </Box>
      <TextField
        value={sellValue}
        onChange={e => {
          let val = e.target.value.replace(/[^0-9.]/g, '');
          val = val.replace(/^(\d)(\d+)/, '$1');
          val = val.replace(/(\..{0,2}).*$/, '$1');
          setSellValue(val);
        }}
        placeholder="3.12"
        sx={{ bgcolor: 'white', borderRadius: 3, width: 140, mx: 2, input: { textAlign: 'center', fontSize: 28, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1.5 } }}
        inputProps={{ maxLength: 5 }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 3 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#23ffbd',
            color: '#060e23',
            fontWeight: 700,
            fontSize: 20,
            borderRadius: 999,
            px: 4,
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            textTransform: 'none',
            fontFamily: 'Roboto, sans-serif',
            '&:hover': { bgcolor: '#1be3a2' },
            mb: 0.5
          }}
          size="medium"
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