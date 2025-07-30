import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import AccountSelectionStep from '../components/AccountSelectionStep';
import TransactionSummary from '../components/TransactionSummary';
import TransferStep from '../components/TransferStep';
import CountdownTimer from '../components/CountdownTimer';
import api from '../services/api';

const steps = ['Cuentas', 'Transferir', 'Completar'];

const OperationFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [operationData, setOperationData] = useState({
    // Datos de la calculadora
    amount: '',
    fromCurrency: '', // 'PEN' o 'USD'
    toCurrency: '', // 'USD' o 'PEN'
    rate: null,
    buyPercent: 1,
    sellPercent: 1,
    
    // Datos de cuentas seleccionadas
    fromAccount: null,
    toAccount: null,
    
    // Datos de la transacción
    manguitos: 0,
    currentRate: null,
    priceUpdated: false
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de la calculadora desde el estado de navegación
        const calculatorData = location.state?.calculatorData;
        if (!calculatorData) {
          navigate('/dashboard');
          return;
        }

        // Obtener tasas y márgenes
        const [rateRes, marginsRes, accountsRes] = await Promise.all([
          api.get('/rates/current'),
          api.get('/admin/public-margins'),
          api.get('/bank-accounts')
        ]);

        const rate = rateRes.data.rate;
        const { buyPercent, sellPercent } = marginsRes.data;
        
        // Determinar monedas según el swap
        const isSwapped = calculatorData.swap;
        const fromCurrency = isSwapped ? 'USD' : 'PEN';
        const toCurrency = isSwapped ? 'PEN' : 'USD';
        
        // Calcular Manguitos (1 por cada dólar)
        const manguitos = fromCurrency === 'USD' 
          ? Math.floor(parseFloat(calculatorData.amount || 0))
          : Math.floor(parseFloat(calculatorData.amount || 0) / rate);

        setOperationData(prev => ({
          ...prev,
          amount: calculatorData.amount || '',
          fromCurrency,
          toCurrency,
          rate,
          buyPercent,
          sellPercent,
          manguitos,
          currentRate: rate
        }));

        setAccounts(accountsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError('Error al cargar los datos de la operación');
        setLoading(false);
      }
    };

    loadInitialData();
  }, [location.state, navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validar que se hayan seleccionado las cuentas
      if (!operationData.fromAccount || !operationData.toAccount) {
        setError('Debes seleccionar ambas cuentas para continuar');
        return;
      }
      setError('');
      // Mostrar modal de confirmación en lugar de avanzar directamente
      setShowConfirmationModal(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleAccountSelection = (fromAccount, toAccount) => {
    setOperationData(prev => ({
      ...prev,
      fromAccount,
      toAccount
    }));
  };

  const handlePriceUpdate = async () => {
    try {
      // Obtener el tipo de cambio más reciente
      const [rateRes, marginsRes] = await Promise.all([
        api.get('/rates/current'),
        api.get('/admin/public-margins')
      ]);

      const newRate = rateRes.data.rate;
      const { buyPercent, sellPercent } = marginsRes.data;

      // Validar que el nuevo rate sea válido
      if (newRate && !isNaN(newRate)) {
        setOperationData(prev => ({
          ...prev,
          currentRate: newRate,
          priceUpdated: true,
          buyPercent,
          sellPercent
        }));

        console.log('Precio actualizado en OperationFlowPage:', {
          newRate,
          buyPercent,
          sellPercent,
          fromCurrency: operationData.fromCurrency,
          toCurrency: operationData.toCurrency
        });
      } else {
        console.error('Rate inválido recibido:', newRate);
      }
    } catch (error) {
      console.error('Error actualizando precio en OperationFlowPage:', error);
    }
  };

  const handleConfirmOperation = () => {
    setShowConfirmationModal(false);
    setActiveStep(1); // Avanzar al siguiente paso
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  // Calcular el tipo de cambio congelado con 4 decimales
  const getFrozenRate = () => {
    const { fromCurrency, currentRate, buyPercent, sellPercent } = operationData;
    
    if (!currentRate || isNaN(currentRate)) {
      return '0.0000';
    }
    
    if (fromCurrency === 'PEN') {
      // Enviando soles, usar precio de venta
      return (currentRate * sellPercent).toFixed(4);
    } else {
      // Enviando dólares, usar precio de compra
      return (currentRate * buyPercent).toFixed(4);
    }
  };

  // Calcular montos para el modal de confirmación
  const calculateAmounts = () => {
    const { amount, fromCurrency, toCurrency, buyPercent, sellPercent } = operationData;
    const rate = operationData.currentRate || operationData.rate;
    
    if (!rate || isNaN(rate)) {
      return { send: '0.00', receive: '0.00', rateUsed: '0.0000' };
    }
    
    if (fromCurrency === 'PEN' && toCurrency === 'USD') {
      // Enviando soles, recibiendo dólares - usar precio de venta
      const rateUsed = rate * sellPercent;
      const receivedAmount = (parseFloat(amount) / rateUsed).toFixed(2);
      return {
        send: `${parseFloat(amount).toFixed(2)} S/`,
        receive: `$${receivedAmount}`,
        rateUsed: rateUsed.toFixed(4)
      };
    } else {
      // Enviando dólares, recibiendo soles - usar precio de compra
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

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <AccountSelectionStep
            accounts={accounts}
            operationData={operationData}
            onAccountSelection={handleAccountSelection}
            error={error}
          />
        );
      case 1:
        return (
          <TransferStep
            operationData={operationData}
            onPriceUpdate={handlePriceUpdate}
          />
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom>
              Operación Completada
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tu operación ha sido procesada exitosamente.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f8f9fa'
      }}>
        <Typography>Cargando operación...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      bgcolor: '#f8f9fa', 
      p: { xs: 1, md: 4 } 
    }}>
      <Paper sx={{ 
        p: { xs: 2, md: 4 }, 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        maxWidth: 800,
        mx: 'auto'
      }}>
        {/* Header con botones de navegación */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleCancel} size="small">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              Operación de Cambio
            </Typography>
          </Box>
          
          {/* Tipo de cambio congelado y cronómetro */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  color: '#666',
                  fontSize: 12
                }}
              >
                Tipo de cambio utilizado:
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  color: '#057c39'
                }}
              >
                {getFrozenRate()}
              </Typography>
            </Box>
            
            {/* Cronómetro */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CountdownTimer 
                duration={4 * 60} // 4 minutos en segundos
                onExpired={handlePriceUpdate}
                size="small"
              />
            </Box>
          </Box>
          
          <Box sx={{ minWidth: 80 }}>
            {activeStep > 0 && (
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ color: '#666' }}
              >
                Atrás
              </Button>
            )}
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Contenido del paso actual */}
        {renderStepContent(activeStep)}

        {/* Botones de navegación */}
        {activeStep < steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ color: '#666' }}
            >
              Atrás
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                bgcolor: '#057c39',
                '&:hover': { bgcolor: '#046a30' }
              }}
            >
              {activeStep === steps.length - 2 ? 'Finalizar' : 'Continuar'}
            </Button>
          </Box>
        )}
      </Paper>

      {/* Modal de Confirmación de Operación */}
      <Dialog
        open={showConfirmationModal}
        onClose={handleCloseConfirmationModal}
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
          py: 3
        }}>
          <CheckCircleIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 24, 
            fontWeight: 700
          }}>
            DETALLE DE OPERACIÓN
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: '#f8f9fa', 
            borderRadius: 2,
            mb: 3
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Banco origen:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                  {operationData.fromAccount?.bank} - {operationData.fromCurrency === 'PEN' ? 'Soles' : 'Dólares'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Banco destino:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                  {operationData.toAccount?.bank} - {operationData.toCurrency === 'PEN' ? 'Soles' : 'Dólares'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Número de cuenta destino:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                  {operationData.toAccount?.accountNumber}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Enviado:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
                  {amounts.send}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Recibido:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
                  {amounts.receive}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                  Tipo de cambio:
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#057c39' }}>
                  {amounts.rateUsed}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            </Box>
          </Paper>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 14 }}>
              Revisa cuidadosamente los detalles de tu operación antes de confirmar.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0, flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmOperation}
            sx={{
              bgcolor: '#057c39',
              color: 'white',
              fontWeight: 700,
              py: 2,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                bgcolor: '#046a30',
              }
            }}
          >
            ESTOY CONFORME
          </Button>
          <Button
            onClick={handleCloseConfirmationModal}
            sx={{
              color: '#666',
              textDecoration: 'underline',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Volver
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationFlowPage; 