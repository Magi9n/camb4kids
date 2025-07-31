import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Alert,
  Link
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import transferAnim from '../assets/transfer.json';
import api from '../services/api';
import { registrarOperacion } from '../services/api';

const TransferStep = ({ operationData }) => {
  const [mangosCashAccount, setMangosCashAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Registrar operación al entrar a la pantalla de transferir
  useEffect(() => {
    const registerOperation = async () => {
      if (
        operationData &&
        operationData.fromAccount &&
        operationData.toAccount &&
        operationData.amount &&
        operationData.user
      ) {
        try {
          // Preparar datos para la operación
          const payload = {
            nombre: `${operationData.user.name || ''} ${operationData.user.lastname || ''}`.trim(),
            dni: operationData.user.document || '',
            telefono: operationData.user.phone || '',
            importe_envia: parseFloat(operationData.amount),
            importe_recibe: operationData.toCurrency === 'PEN'
              ? parseFloat((parseFloat(operationData.amount) * (operationData.currentRate * operationData.buyPercent)).toFixed(2))
              : parseFloat((parseFloat(operationData.amount) / (operationData.currentRate * operationData.sellPercent)).toFixed(2)),
            tipo_cambio: parseFloat(operationData.toCurrency === 'PEN'
              ? (operationData.currentRate * operationData.buyPercent).toFixed(4)
              : (operationData.currentRate * operationData.sellPercent).toFixed(4)),
            moneda_envia: operationData.fromCurrency,
            moneda_recibe: operationData.toCurrency,
            estado: 'Falta Transferir'
          };
          
          await registrarOperacion(payload);
          console.log('Operación registrada exitosamente:', payload);
        } catch (error) {
          console.error('Error registrando operación:', error);
          setSnackbar({ 
            open: true, 
            message: 'Error al registrar la operación', 
            severity: 'error' 
          });
        }
      }
    };

    registerOperation();
  }, [operationData]);

  useEffect(() => {
    const loadMangosCashAccount = async () => {
      try {
        setLoading(true);
        
        // Determinar qué cuenta de MangosCash mostrar según el banco origen y moneda
        const fromBank = operationData.fromAccount?.bank;
        const currency = operationData.fromCurrency;
        
        // Mapear bancos a códigos
        const bankMapping = {
          'BCP': 'bcp',
          'BBVA': 'bbva', 
          'Scotiabank': 'scotiabank',
          'Interbank': 'interbank'
        };
        
        const bankCode = bankMapping[fromBank] || 'interbank'; // Default a interbank para otros bancos
        
        // Obtener la cuenta de MangosCash correspondiente
        const response = await api.get(`/admin/mangos-cash-accounts/${bankCode}/${currency.toLowerCase()}`);
        setMangosCashAccount(response.data);
        
      } catch (error) {
        console.error('Error cargando cuenta de MangosCash:', error);
        setSnackbar({ 
          open: true, 
          message: 'Error al cargar la información de transferencia', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    if (operationData.fromAccount && operationData.fromCurrency) {
      loadMangosCashAccount();
    }
  }, [operationData.fromAccount, operationData.fromCurrency]);

  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ 
        open: true, 
        message: `${fieldName} copiado al portapapeles`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Error al copiar', 
        severity: 'error' 
      });
    }
  };

  const formatAmount = () => {
    const amount = parseFloat(operationData.amount).toFixed(2);
    const currency = operationData.fromCurrency === 'PEN' ? 'Soles' : 'Dólares';
    return `${amount} ${currency}`;
  };

  const getBankDisplayName = () => {
    const bank = operationData.fromAccount?.bank;
    return bank || 'tu banco';
  };

  const shouldShowCCI = () => {
    const fromBank = operationData.fromAccount?.bank;
    const toBank = mangosCashAccount?.bank;
    
    // Mostrar CCI si el banco origen NO es Interbank y el destino SÍ es Interbank
    return fromBank !== 'Interbank' && toBank === 'Interbank';
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography>Cargando información de transferencia...</Typography>
      </Box>
    );
  }

  if (!mangosCashAccount) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">
          No se pudo cargar la información de la cuenta de MangosCash
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {/* Lottie Animation */}
      <Box sx={{ 
        width: 200, 
        height: 200, 
        mx: 'auto', 
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Lottie 
          animationData={transferAnim} 
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
          mb: 4
        }}
      >
        Transfiere a MangosCash
      </Typography>

      {/* Instrucciones */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: '#333',
            mb: 2
          }}
        >
          1. Transfiere{' '}
          <Box component="span" sx={{ fontWeight: 700, color: '#057c39' }}>
            {formatAmount()}
          </Box>
          {' '}desde tu banco{' '}
          <Box component="span" sx={{ fontWeight: 700, color: '#057c39' }}>
            {getBankDisplayName()}
          </Box>
          {' '}a nuestra cuenta.
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: '#333'
          }}
        >
          2. Guarda el{' '}
          <Box component="span" sx={{ 
            fontWeight: 700, 
            color: '#057c39',
            textDecoration: 'underline'
          }}>
            número de tu operación
          </Box>
          {' '}para el siguiente paso.
        </Typography>
      </Box>

      {/* Información de la cuenta */}
      <Paper sx={{ 
        p: 4, 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        mb: 4,
        maxWidth: 600,
        mx: 'auto',
        bgcolor: '#fff',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Banco:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
              {mangosCashAccount.bank} - {mangosCashAccount.bankFullName}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Número de cuenta:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                {mangosCashAccount.accountNumber}
              </Typography>
              <IconButton 
                size="small"
                onClick={() => handleCopy(mangosCashAccount.accountNumber, 'Número de cuenta')}
                sx={{ color: '#1976d2' }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {shouldShowCCI() && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                CCI:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                  {mangosCashAccount.cci}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleCopy(mangosCashAccount.cci, 'CCI')}
                  sx={{ color: '#1976d2' }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              RUC:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                {mangosCashAccount.ruc}
              </Typography>
              <IconButton 
                size="small"
                onClick={() => handleCopy(mangosCashAccount.ruc, 'RUC')}
                sx={{ color: '#1976d2' }}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Titular de la cuenta:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
              {mangosCashAccount.accountHolder}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Tipo de Cuenta:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
              {mangosCashAccount.accountType} - {operationData.fromCurrency === 'PEN' ? 'soles' : 'dólares'}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Link al detalle */}
      <Link 
        href="#" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          color: '#666',
          textDecoration: 'underline',
          mb: 4,
          display: 'inline-block'
        }}
      >
        Detalle de tu operación
      </Link>

      {/* Botón principal */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: '#57C9A6',
          color: 'white',
          fontWeight: 700,
          py: 2.5,
          borderRadius: 3,
          textTransform: 'none',
          fontSize: 16,
          maxWidth: 500,
          boxShadow: '0 4px 20px rgba(87, 201, 166, 0.3)',
          '&:hover': {
            bgcolor: '#3bbd8c',
            boxShadow: '0 6px 25px rgba(87, 201, 166, 0.4)',
          }
        }}
      >
        YA HICE MI TRANSFERENCIA
      </Button>

      {/* WhatsApp flotante */}
      <Box sx={{ 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000
      }}>
        <IconButton
          sx={{
            bgcolor: '#25D366',
            color: 'white',
            width: 60,
            height: 60,
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
            '&:hover': {
              bgcolor: '#128C7E',
            }
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Snackbar para notificaciones */}
      <Alert 
        severity={snackbar.severity}
        sx={{ 
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          display: snackbar.open ? 'flex' : 'none'
        }}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        {snackbar.message}
      </Alert>
    </Box>
  );
};

export default TransferStep; 