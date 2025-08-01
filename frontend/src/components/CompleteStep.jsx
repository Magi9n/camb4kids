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
  TextField
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import reciboAnim from '../assets/recibo.json';
import bcpGif from '../assets/bcp.gif';

const CompleteStep = ({ operationData }) => {
  const [showOperationNumberModal, setShowOperationNumberModal] = useState(false);
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
          mb: 2
        }}
      >
        Envía tu constancia
      </Typography>

      {/* Instrucción */}
      <Typography 
        variant="body1" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          color: '#666',
          mb: 2
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
          sx={{ bgcolor: '#fff' }}
        />
      </Box>

      {/* Ayuda para encontrar el número de operación */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          color: '#057c39',
          textDecoration: 'underline',
          cursor: 'pointer',
          mb: 3
        }}
        onClick={() => setShowOperationNumberModal(true)}
      >
        ¿Dónde encuentro el número de operación?
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
    </Box>
  );
};

export default CompleteStep; 