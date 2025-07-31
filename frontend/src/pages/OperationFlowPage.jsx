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
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [currentOperationId, setCurrentOperationId] = useState(null);
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

        // Obtener tasas, márgenes, cuentas y perfil del usuario
        const [rateRes, marginsRes, accountsRes, userProfileRes] = await Promise.all([
          api.get('/rates/current'),
          api.get('/admin/public-margins'),
          api.get('/bank-accounts'),
          api.get('/auth/profile')
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
          currentRate: rate,
          user: userProfileRes.data // Agregar datos del usuario
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
    if (activeStep === 1) {
      // Si estamos en el paso de transferir, mostrar modal de confirmación
      setShowBackModal(true);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      if (currentOperationId) {
        // Eliminar la operación de la BD
        await api.delete(`/operations/${currentOperationId}`);
      }
      setShowCancelModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error eliminando operación:', error);
      setShowCancelModal(false);
      navigate('/dashboard');
    }
  };

  const handleConfirmBack = async () => {
    try {
      if (currentOperationId) {
        // Eliminar la operación de la BD
        await api.delete(`/operations/${currentOperationId}`);
      }
      setShowBackModal(false);
      setActiveStep(0);
    } catch (error) {
      console.error('Error eliminando operación:', error);
      setShowBackModal(false);
      setActiveStep(0);
    }
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

  const handleOperationCreated = (operationId) => {
    setCurrentOperationId(operationId);
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
            onOperationCreated={handleOperationCreated}
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
      py: 4
    }}>
      <Paper sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 4,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        bgcolor: 'white'
      }}>
        {/* Header con botones de navegación */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CountdownTimer 
              onTimeUp={handlePriceUpdate}
              isActive={activeStep === 1}
            />
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

        {/* Botón X para cerrar */}
        <IconButton
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
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
                  Monto a enviar:
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

      {/* Modal de Cancelación */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
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
          bgcolor: '#f44336',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <WarningIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 20, 
            fontWeight: 700
          }}>
            ¿CANCELAR OPERACIÓN?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 14 }}>
              <strong>¡Atención!</strong> Si ya realizaste la transferencia bancaria, 
              debes continuar con el proceso para completar tu operación.
            </Typography>
          </Alert>
          
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 16, textAlign: 'center' }}>
            ¿Estás seguro de que deseas cancelar esta operación?
          </Typography>
          
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, textAlign: 'center', color: '#666', mt: 2 }}>
            Esta acción eliminará la operación de nuestros registros.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowCancelModal(false)}
            sx={{
              borderColor: '#666',
              color: '#666',
              fontWeight: 600,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                borderColor: '#333',
                color: '#333'
              }
            }}
          >
            CONTINUAR OPERACIÓN
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmCancel}
            sx={{
              bgcolor: '#f44336',
              color: 'white',
              fontWeight: 700,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                bgcolor: '#d32f2f'
              }
            }}
          >
            SÍ, CANCELAR
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmación Atrás */}
      <Dialog
        open={showBackModal}
        onClose={() => setShowBackModal(false)}
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
          bgcolor: '#ff9800',
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <WarningIcon sx={{ fontSize: 40, mb: 1 }} />
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 20, 
            fontWeight: 700
          }}>
            ¿VOLVER ATRÁS?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 14 }}>
              <strong>¡Atención!</strong> Si ya realizaste la transferencia bancaria, 
              debes presionar "YA HICE MI TRANSFERENCIA" para continuar.
            </Typography>
          </Alert>
          
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 16, textAlign: 'center' }}>
            ¿Estás seguro de que deseas volver al paso anterior?
          </Typography>
          
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 14, textAlign: 'center', color: '#666', mt: 2 }}>
            Esta acción eliminará la operación actual de nuestros registros.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0, justifyContent: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setShowBackModal(false)}
            sx={{
              borderColor: '#666',
              color: '#666',
              fontWeight: 600,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                borderColor: '#333',
                color: '#333'
              }
            }}
          >
            CONTINUAR AQUÍ
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBack}
            sx={{
              bgcolor: '#ff9800',
              color: 'white',
              fontWeight: 700,
              py: 1.5,
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 14,
              '&:hover': {
                bgcolor: '#f57c00'
              }
            }}
          >
            SÍ, VOLVER
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperationFlowPage; 