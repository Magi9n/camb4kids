import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import reciboAnim from '../assets/recibo.json';
import bcpGif from '../assets/bcp.gif';

const CompleteStep = ({ operationData }) => {
  const [showOperationNumberModal, setShowOperationNumberModal] = useState(false);

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

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {/* Lottie Animation */}
      <Box sx={{ 
        width: 200, 
        height: 200, 
        mx: 'auto', 
        mb: 3,
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
          mb: 3
        }}
      >
        ¡Operación Completada!
      </Typography>

      {/* Mensaje principal */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          color: '#666',
          mb: 4,
          px: 2
        }}
      >
        Verificaremos tu operación para transferir{' '}
        <Box component="span" sx={{ fontWeight: 700, color: '#057c39' }}>
          {amounts.amountToReceive.toFixed(2)} {operationData.toCurrency === 'PEN' ? 'Soles' : 'Dólares'}
        </Box>
        {' '}a tu cuenta.
      </Typography>

      {/* Información adicional */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        mb: 3,
        maxWidth: 500,
        mx: 'auto',
        bgcolor: '#fff',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Monto enviado:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#057c39' }}>
              {amounts.amountToSend.toFixed(2)} {operationData.fromCurrency}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Monto a recibir:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#057c39' }}>
              {amounts.amountToReceive.toFixed(2)} {operationData.toCurrency}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Tipo de cambio:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
              {amounts.rateUsed.toFixed(4)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Instrucciones */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: '#333',
            mb: 2
          }}
        >
          Guarda el{' '}
          <Box 
            component="span" 
            sx={{ 
              fontWeight: 700, 
              color: '#057c39',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
            onClick={() => setShowOperationNumberModal(true)}
          >
            número de tu operación
          </Box>
          {' '}para el seguimiento.
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            color: '#666'
          }}
        >
          Te notificaremos cuando la transferencia esté lista.
        </Typography>
      </Box>

      {/* Botón de WhatsApp flotante */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000
      }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#25D366',
            color: 'white',
            borderRadius: '50%',
            width: 60,
            height: 60,
            minWidth: 'auto',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
            '&:hover': {
              bgcolor: '#128C7E',
            }
          }}
        >
          <Typography sx={{ fontSize: 24 }}>📱</Typography>
        </Button>
      </Box>

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
    </Box>
  );
};

export default CompleteStep; 