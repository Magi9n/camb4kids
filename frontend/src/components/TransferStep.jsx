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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import transferAnim from '../assets/transfer.json';
import bcpGif from '../assets/bcp.gif';
import api from '../services/api';
import { registrarOperacion } from '../services/api';

const TransferStep = ({ operationData, onOperationCreated }) => {
  const [mangosCashAccount, setMangosCashAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOperationNumberModal, setShowOperationNumberModal] = useState(false);
  const [operationCreated, setOperationCreated] = useState(false);

  // Registrar operación al entrar a la pantalla de transferir
  useEffect(() => {
    const registerOperation = async () => {
      // Evitar crear múltiples operaciones
      if (operationCreated) {
        return;
      }

      // Verificar si ya existe una operación (cuando se recarga la página)
      if (operationData.operationId) {
        console.log('Operación ya existe, no se creará una nueva:', operationData.operationId);
        setOperationCreated(true);
        
        // Pasar el ID existente al componente padre
        if (onOperationCreated) {
          onOperationCreated(operationData.operationId);
        }
        return;
      }

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
          
          const response = await registrarOperacion(payload);
          console.log('Operación registrada exitosamente:', response.data);
          
          // Marcar como creada para evitar duplicados
          setOperationCreated(true);
          
          // Pasar el ID de la operación al componente padre
          if (onOperationCreated && response.data.id) {
            onOperationCreated(response.data.id);
          }
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
  }, [operationData, onOperationCreated, operationCreated]);

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
        
        // Mapear monedas a códigos de la base de datos
        const currencyMapping = {
          'PEN': 'soles',
          'USD': 'dollars'
        };
        
        const bankCode = bankMapping[fromBank] || 'interbank'; // Default a interbank para otros bancos
        const currencyCode = currencyMapping[currency] || 'soles'; // Default a soles
        
        console.log(`Buscando cuenta para banco: ${bankCode}, moneda: ${currencyCode}`);
        
        // Obtener la cuenta de MangosCash correspondiente
        const response = await api.get(`/admin/mangos-cash-accounts/${bankCode}/${currencyCode}`);
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
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback para navegadores que no soportan clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setSnackbar({ 
        open: true, 
        message: `${fieldName} copiado al portapapeles`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Error al copiar:', error);
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

  const getMangosCashBankName = () => {
    const bank = mangosCashAccount?.bank;
    if (!bank) return '';
    
    // Capitalizar la primera letra
    return bank.charAt(0).toUpperCase() + bank.slice(1);
  };

  const shouldShowCCI = () => {
    const fromBank = operationData.fromAccount?.bank;
    const toBank = mangosCashAccount?.bank;
    
    // Mostrar CCI si el banco origen NO es Interbank y el destino SÍ es Interbank
    return fromBank !== 'Interbank' && toBank === 'interbank';
  };

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

  // Escuchar cambios en operationData para actualizar automáticamente
  useEffect(() => {
    if (operationData.currentRate && operationData.buyPercent && operationData.sellPercent) {
      // Los montos se actualizan automáticamente cuando cambia el tipo de cambio
      // porque calculateAmounts() usa operationData.currentRate
      console.log('Tipo de cambio actualizado en TransferStep:', operationData.currentRate);
    }
  }, [operationData.currentRate, operationData.buyPercent, operationData.sellPercent]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography>Cargando información de transferencia...</Typography>
      </Box>
    );
  }

  if (!mangosCashAccount) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography color="error">
          No se pudo cargar la información de la cuenta de MangosCash
        </Typography>
      </Box>
    );
  }

  const amounts = calculateAmounts();

  return (
    <Box sx={{ textAlign: 'center', py: 1 }}>
      {/* Lottie Animation - Más pequeño */}
      <Box sx={{ 
        width: 120, 
        height: 120, 
        mx: 'auto', 
        mb: 2,
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
        variant="h5" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          color: '#333',
          mb: 2
        }}
      >
        Transfiere a MangosCash
      </Typography>

      {/* Instrucciones */}
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            color: '#333',
            mb: 1
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
            fontWeight: 600,
            color: '#333'
          }}
        >
          2. Guarda el{' '}
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
          {' '}para el siguiente paso.
        </Typography>
      </Box>

      {/* Información de la cuenta */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        mb: 2,
        maxWidth: 500,
        mx: 'auto',
        bgcolor: '#fff',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
              Banco:
            </Typography>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
              {getMangosCashBankName()}
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

      {/* Link al detalle y botón */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Link 
          component="button"
          onClick={() => setShowDetailsModal(true)}
          sx={{ 
            fontFamily: 'Roboto, sans-serif',
            color: '#666',
            textDecoration: 'underline',
            display: 'block',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            mb: 2,
            width: '100%'
          }}
        >
          Detalle de tu operación
        </Link>
        
        {/* Botón principal - Centrado debajo del link */}
        <Button
          variant="contained"
          sx={{
            bgcolor: '#57C9A6',
            color: 'white',
            fontWeight: 700,
            py: 1.5,
            px: 3,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: 14,
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
            width: 50,
            height: 50,
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.3)',
            '&:hover': {
              bgcolor: '#128C7E',
            }
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Box>

      {/* Modal de Detalles de Operación */}
      <Dialog
        open={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
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
            fontSize: 20, 
            fontWeight: 700
          }}>
            DETALLE DE OPERACIÓN
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Paper sx={{ 
            p: 2, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2,
            mb: 2
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Banco origen:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 14 }}>
                  {operationData.fromAccount?.bank} - {operationData.fromCurrency === 'PEN' ? 'Soles' : 'Dólares'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Banco destino:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 14 }}>
                  {operationData.toAccount?.bank} - {operationData.toCurrency === 'PEN' ? 'Soles' : 'Dólares'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Cuenta destino:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 14 }}>
                  {operationData.toAccount?.accountNumber}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Monto a enviar:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 14, color: '#057c39' }}>
                  {amounts.amountToSend.toFixed(2)} {operationData.fromCurrency}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Monto a recibir:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 14, color: '#057c39' }}>
                  {amounts.amountToReceive.toFixed(2)} {operationData.toCurrency}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Tipo de cambio:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, fontSize: 14 }}>
                  {amounts.rateUsed.toFixed(4)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666', fontSize: 14 }}>
                  Manguitos:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 14 }}>
                    {operationData.manguitos}
                  </Typography>
                  <Chip 
                    label="🪙" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ffd700',
                      color: '#333',
                      fontWeight: 700,
                      height: 20
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 12 }}>
              Revisa cuidadosamente los detalles de tu operación antes de confirmar.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => setShowDetailsModal(false)}
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
              Guárdalo para el siguiente paso del proceso.
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