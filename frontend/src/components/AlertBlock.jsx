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
  const [userAlerts, setUserAlerts] = useState([]);

  React.useEffect(() => {
    api.get('/rates/current').then(res => setCurrentRate(res.data.rate)).catch(() => {});
  }, []);

  React.useEffect(() => {
    if (token && user) {
      api.get('/alerts')
        .then(res => setUserAlerts(res.data))
        .catch(() => setUserAlerts([]));
    } else {
      setUserAlerts([]);
    }
  }, [token, user]);

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
      title: '¡Inicia sesión o crea una cuenta!',
      message: 'Para crear una alerta personalizada debes iniciar sesión o registrarte. Así podrás recibir notificaciones en tu correo cuando el dólar alcance los valores que te interesan.'
    });
    setModalOpen(true);
  };

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    setError('');
    const err = validate();
    if (err) {
      return setError(err);
    }
    if (!token || !user) {
      showLoginModal();
      return;
    }

    // Verificar si ya existe una alerta igual
    const buyExists = buyValue && userAlerts.some(a => a.type === 'buy' && parseFloat(a.value) === parseFloat(buyValue));
    const sellExists = sellValue && userAlerts.some(a => a.type === 'sell' && parseFloat(a.value) === parseFloat(sellValue));
    if (buyExists || sellExists) {
      let msg = 'Ya tienes una alerta registrada con los siguientes valores:';
      if (buyExists) msg += `\n- Compra: ${buyValue}`;
      if (sellExists) msg += `\n- Venta: ${sellValue}`;
      msg += '\nPuedes modificar o eliminar tus alertas desde tu panel de usuario.';
      setModalContent({
        title: 'Alerta ya registrada',
        message: msg.replace(/\n/g, '<br />'),
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
          title: '¡Alerta creada!',
          message: `Te avisaremos al correo ${user.email} cuando la compra supere ${buyValue || '...'} o la venta baje de ${sellValue || '...'}.`,
        });
        setModalOpen(true);
        setBuyValue('');
        setSellValue('');
        // Refrescar alertas del usuario
        api.get('/alerts').then(res => setUserAlerts(res.data)).catch(() => {});
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Error al crear la alerta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#060e23', py: 3, px: { xs: 1, md: 3 }, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: 2, borderRadius: 3, mt: 0, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: isMobile ? 1.5 : 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: 'white', fontFamily: 'Roboto, sans-serif', mr: 1, textAlign: 'right', minWidth: 0 }}>
          Alertar cuando la Compra del dólar esté por encima de
        </Typography>
        <TextField
          value={buyValue}
          onChange={e => setBuyValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
          placeholder="Ej: 3.229"
          sx={{ bgcolor: 'white', borderRadius: 2, width: 90, input: { textAlign: 'center', fontSize: 18, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1 } }}
          inputProps={{ maxLength: 7 }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: isMobile ? 1.5 : 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 400, color: 'white', fontFamily: 'Roboto, sans-serif', mr: 1, textAlign: 'right', minWidth: 0 }}>
          Alertar cuando la Venta del dólar esté por debajo de
        </Typography>
        <TextField
          value={sellValue}
          onChange={e => setSellValue(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
          placeholder="Ej: 3.229"
          sx={{ bgcolor: 'white', borderRadius: 2, width: 90, input: { textAlign: 'center', fontSize: 18, fontWeight: 400, fontFamily: 'Roboto, sans-serif', p: 1 } }}
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
            fontSize: 18,
            borderRadius: 999,
            px: 3,
            py: 1,
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
            textTransform: 'none',
            fontFamily: 'Roboto, sans-serif',
            '&:hover': { bgcolor: '#1be3a2' },
            mb: 1
          }}
          size="medium"
          type="submit"
          disabled={loading || (!buyValue && !sellValue)}
        >
          Crear alerta
        </Button>
        <Typography sx={{ color: 'white', fontSize: 12, fontFamily: 'Roboto, sans-serif', mt: 0 }}>
          *Tienes que iniciar sesión
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1, fontSize: 13 }}>{error}</Typography>}
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
          <Typography sx={{ fontSize: 18, fontFamily: 'Roboto, sans-serif', color: '#222', mb: 2 }} dangerouslySetInnerHTML={{ __html: modalContent.message }} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
          {modalContent.title.includes('Inicia sesión') ? (
            <Button
              onClick={() => window.location.href = '/login'}
              variant="contained"
              sx={{ bgcolor: '#057c39', color: 'white', borderRadius: 999, px: 4, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 18, mb: 1 }}
            >
              Iniciar sesión
            </Button>
          ) : null}
          <Button onClick={() => setModalOpen(false)} variant="outlined" sx={{ borderColor: '#057c39', color: '#057c39', borderRadius: 999, px: 4, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 18 }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertBlock; 