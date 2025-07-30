import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Alert,
  Link,
  Divider,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  AccountBalance as BankIcon,
  Payment as PaymentIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import transferAnim from '../assets/transfer.json';
import api from '../services/api';

const TransferStep = ({ operationData }) => {
  const [mangosCashAccount, setMangosCashAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [operationId, setOperationId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        
        // Crear la operación en la base de datos
        await createOperation();
        
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

  const createOperation = async () => {
    try {
      const amounts = calculateAmounts();
      
      const operationData = {
        userName: `${operationData.fromAccount?.accountName || 'Usuario'}`,
        userDni: '12345678', // Esto debería venir del usuario autenticado
        userPhone: '+51 999 999 999', // Esto debería venir del usuario autenticado
        amountToSend: parseFloat(operationData.amount),
        exchangeRate: parseFloat(amounts.rateUsed),
        amountToReceive: parseFloat(amounts.receive.replace(/[^0-9.]/g, '')),
        fromCurrency: operationData.fromCurrency,
        toCurrency: operationData.toCurrency,
        fromBank: operationData.fromAccount?.bank,
        toBank: operationData.toAccount?.bank,
        fromAccountNumber: operationData.fromAccount?.accountNumber,
        toAccountNumber: operationData.toAccount?.accountNumber,
        manguitos: operationData.manguitos,
        status: 'PENDING_TRANSFER'
      };

      const response = await api.post('/operations', operationData);
      setOperationId(response.data.id);
      
      console.log('Operación creada:', response.data);
    } catch (error) {
      console.error('Error creando operación:', error);
    }
  };

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

  const calculateAmounts = () => {
    const { amount, fromCurrency, toCurrency, buyPercent, sellPercent } = operationData;
    const rate = operationData.currentRate || operationData.rate;
    
    if (!rate || isNaN(rate)) {
      return { send: '0.00', receive: '0.00', rateUsed: '0.0000' };
    }
    
    if (fromCurrency === 'PEN' && toCurrency === 'USD') {
      const rateUsed = rate * sellPercent;
      const receivedAmount = (parseFloat(amount) / rateUsed).toFixed(2);
      return {
        send: `${parseFloat(amount).toFixed(2)} S/`,
        receive: `$${receivedAmount}`,
        rateUsed: rateUsed.toFixed(4)
      };
    } else {
      const rateUsed = rate * buyPercent;
      const receivedAmount = (parseFloat(amount) * rateUsed).toFixed(2);
      return {
        send: `$${parseFloat(amount).toFixed(2)}`,
        receive: `${receivedAmount} S/`,
        rateUsed: rateUsed.toFixed(4)
      };
    }
  };

  const amounts = calculateAmounts();

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
    <Box sx={{ py: 2 }}>
      {/* Header con animación */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ 
          width: 150, 
          height: 150, 
          mx: 'auto', 
          mb: 3,
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

        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            color: '#333',
            mb: 1
          }}
        >
          Transfiere a MangosCash
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#666',
            fontFamily: 'Roboto, sans-serif'
          }}
        >
          Operación #{operationId} - Estado: Pendiente de transferencia
        </Typography>
      </Box>

      {/* Resumen de la operación */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <PaymentIcon sx={{ color: '#057c39' }} />
            Resumen de tu operación
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Envías:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18, color: '#057c39' }}>
                  {amounts.send}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Recibes:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18, color: '#057c39' }}>
                  {amounts.receive}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Tipo de cambio:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#057c39' }}>
                  {amounts.rateUsed}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Manguitos:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>
                    {operationData.manguitos}
                  </Typography>
                  <Chip 
                    label="🪙" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffd700',
                      color: '#333',
                      fontWeight: 700
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ScheduleIcon sx={{ color: '#057c39' }} />
            Instrucciones de transferencia
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                color: '#333',
                lineHeight: 1.6
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
              variant="body1" 
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                color: '#333',
                lineHeight: 1.6
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
        </CardContent>
      </Card>

      {/* Información de la cuenta */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <BankIcon sx={{ color: '#057c39' }} />
            Cuenta de MangosCash
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        </CardContent>
      </Card>

      {/* Información de seguridad */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', bgcolor: '#f8f9fa' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <SecurityIcon sx={{ color: '#057c39' }} />
            Información de seguridad
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              color: '#666',
              lineHeight: 1.6
            }}
          >
            • Solo transfiere a cuentas a nombre de MangosCash SAC
            <br />
            • Guarda el comprobante de transferencia
            <br />
            • El proceso puede tomar hasta 15 minutos en transferencias inmediatas
            <br />
            • Para transferencias interbancarias puede tomar hasta 1 día hábil
          </Typography>
        </CardContent>
      </Card>

      {/* Botón principal */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
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
            fontSize: 18,
            maxWidth: 400,
            boxShadow: '0 4px 20px rgba(87, 201, 166, 0.3)',
            '&:hover': {
              bgcolor: '#3bbd8c',
              boxShadow: '0 6px 25px rgba(87, 201, 166, 0.4)',
            }
          }}
        >
          YA HICE MI TRANSFERENCIA
        </Button>
      </Box>

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