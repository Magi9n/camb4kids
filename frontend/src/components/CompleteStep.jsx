import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  TextField,
  Slide,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import reciboAnim from '../assets/recibo.json';
import bcpGif from '../assets/bcp.gif';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const CompleteStep = ({ operationData }) => {
  const [showOperationNumberModal, setShowOperationNumberModal] = useState(false);
  const [showTransferDetailModal, setShowTransferDetailModal] = useState(false);
  const [operationNumber, setOperationNumber] = useState('');

  const calculateAmounts = () => {
    const amount = parseFloat(operationData.amount);
    const rate = operationData.currentRate;
    const buyPercent = operationData.buyPercent;
    const sellPercent = operationData.sellPercent;

    if (operationData.fromCurrency === 'PEN') {
      // Enviando PEN, recibiendo USD
      const amountToReceive = amount / (rate * buyPercent);
      return {
        amountToSend: amount,
        amountToReceive: amountToReceive,
        rateUsed: rate * buyPercent
      };
    } else {
      // Enviando USD, recibiendo PEN
      const amountToReceive = amount * (rate * sellPercent);
      return {
        amountToSend: amount,
        amountToReceive: amountToReceive,
        rateUsed: rate * sellPercent
      };
    }
  };

  const amounts = calculateAmounts();
  const mangosCashAccount = operationData.mangosCashAccount || {};
  const userAccount = operationData.toAccount || {};

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {/* Lottie Animation */}
      <Box sx={{ 
        width: 110, 
        height: 110, 
        mx: 'auto', 
        mb: 1,
        mt: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Lottie 
          animationData={reciboAnim} 
          loop={true} 
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* Título */}
      <Typography 
        variant="h4" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          color: '#333',
          mb: 2,
          mt: 0
        }}
      >
        Envía tu constancia
      </Typography>

      {/* Label centrado */}
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          color: '#666',
          mb: 1,
          textAlign: 'center'
        }}
      >
        Escribe el número de operación de la transferencia aquí:
      </Typography>

      {/* Input para número de operación */}
      <Box sx={{ mb: 2, maxWidth: 350, mx: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Número de operación"
          value={operationNumber}
          onChange={e => setOperationNumber(e.target.value)}
          inputProps={{ style: { textAlign: 'center' } }}
          sx={{
            bgcolor: '#fff',
            borderRadius: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
            '& input': {
              textAlign: 'center',
            }
          }}
        />
      </Box>

      {/* Ayuda para encontrar el número de operación */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          color: '#666',
          mb: 1,
          textAlign: 'center'
        }}
      >
        ¿Dónde encuentro el{' '}
        <Box
          component="span"
          sx={{
            fontWeight: 700,
            color: '#057c39',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline',
          }}
          onClick={() => setShowOperationNumberModal(true)}
        >
          número de operación
        </Box>
        ?
      </Typography>

      {/* ¿Aún no haces la transferencia? */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          color: '#057c39',
          textDecoration: 'underline',
          cursor: 'pointer',
          mb: 3,
          textAlign: 'center',
          fontWeight: 500
        }}
        onClick={() => setShowTransferDetailModal(true)}
      >
        ¿Aún no haces la transferencia?
      </Typography>

      {/* Mensaje de verificación */}
      <Typography
        variant="body1"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#333',
          mb: 4
        }}
      >
        Verificaremos tu operación para transferir{' '}
        <Box component="span" sx={{ fontWeight: 700, color: '#057c39' }}>
          {amounts.amountToReceive.toFixed(2)} {operationData.toCurrency === 'PEN' ? 'Soles' : 'Dólares'}
        </Box>
        {' '}a tu cuenta.
      </Typography>

      {/* Botón para enviar constancia */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          bgcolor: '#057c39',
          color: 'white',
          fontWeight: 700,
          py: 1.5,
          px: 4,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: 16,
          boxShadow: '0 4px 20px rgba(5, 124, 57, 0.15)',
          mb: 2,
          mt: 1,
          '&:hover': {
            bgcolor: '#046a30'
          }
        }}
        // Aquí puedes agregar la lógica para enviar la constancia
      >
        Envía tu constancia
      </Button>

      {/* Modal del Número de Operación */}
      <Dialog
        open={showOperationNumberModal}
        onClose={() => setShowOperationNumberModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: '#057c39',
          color: 'white',
          textAlign: 'center',
          py: 2
        }}>
          <CheckCircleIcon sx={{ fontSize: 32, mb: 1 }} />
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 18, 
            fontWeight: 700
          }}>
            NÚMERO DE OPERACIÓN
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 14,
            textAlign: 'center',
            mb: 2
          }}>
            Puedes encontrar el número de operación del voucher o resumen en el siguiente ejemplo:
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 2
          }}>
            <img 
              src={bcpGif} 
              alt="Ejemplo de voucher BCP" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px',
                height: 'auto',
                borderRadius: 8
              }}
            />
          </Box>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 12 }}>
              El número de operación aparece en el voucher o resumen de tu transferencia bancaria. 
              Guárdalo para el seguimiento de tu operación.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => setShowOperationNumberModal(false)}
            sx={{
              bgcolor: '#057c39',
              color: 'white',
              fontWeight: 700,
              py: 1,
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                bgcolor: '#046a30'
              }
            }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal lateral derecho para detalle de transferencia */}
      <Dialog
        open={showTransferDetailModal}
        onClose={() => setShowTransferDetailModal(false)}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="xs"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            m: 0,
            borderRadius: '16px 0 0 16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            width: { xs: '100vw', sm: 400 },
            maxWidth: 400,
            p: 0
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '16px 0 0 16px',
            height: '100vh',
            p: 0,
            bgcolor: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }
        }}
      >
        <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
              Transferencia Bancaria
            </Typography>
            <Button onClick={() => setShowTransferDetailModal(false)} sx={{ minWidth: 0, p: 0, color: '#666' }}>
              <CloseIcon />
            </Button>
          </Box>
          <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: 15 }}>
              ¿A dónde tengo que transferir?
            </Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: 500 }}>Banco</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#057c39' }}>{mangosCashAccount.bankFullName || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: 500 }}>Número de cuenta</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{mangosCashAccount.accountNumber || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: 500 }}>RUC</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{mangosCashAccount.ruc || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: 500 }}>Titular de la cuenta</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{mangosCashAccount.accountHolder || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: '#666', fontWeight: 500 }}>Tipo de Cuenta</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{mangosCashAccount.accountType || '-'}</Typography>
                </Box>
              </Box>
            </Paper>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: 15 }}>
              ¿Cuánto tengo que transferir?
            </Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 'none' }}>
              <Typography sx={{ fontWeight: 700, color: '#057c39', fontSize: 18 }}>
                {amounts.amountToSend.toFixed(2)} {operationData.fromCurrency}
              </Typography>
            </Paper>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: 15 }}>
              ¿Cuánto recibiré?
            </Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 'none' }}>
              <Typography sx={{ fontWeight: 700, color: '#057c39', fontSize: 18 }}>
                {amounts.amountToReceive.toFixed(2)} {operationData.toCurrency}
              </Typography>
            </Paper>
            <Typography sx={{ fontWeight: 600, mb: 1, color: '#333', fontSize: 15 }}>
              ¿En qué cuenta lo recibiré?
            </Typography>
            <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, boxShadow: 'none' }}>
              <Typography sx={{ fontWeight: 700, color: '#057c39', fontSize: 16 }}>
                {userAccount.bank || '-'} - {userAccount.accountNumber || '-'}
              </Typography>
            </Paper>
          </Box>
          <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
            <Button
              variant="contained"
              onClick={() => setShowTransferDetailModal(false)}
              sx={{
                bgcolor: '#057c39',
                color: 'white',
                fontWeight: 700,
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: 16,
                boxShadow: '0 4px 20px rgba(5, 124, 57, 0.15)',
                '&:hover': {
                  bgcolor: '#046a30'
                }
              }}
            >
              ENTENDIDO
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CompleteStep; 