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
  Alert
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AccountSelectionStep from '../components/AccountSelectionStep';
import TransactionSummary from '../components/TransactionSummary';
import CountdownTimer from '../components/CountdownTimer';
import api from '../services/api';

const steps = ['Cuentas', 'Transferir', 'Completar'];

const OperationFlowPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
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

  const handlePriceUpdate = (newRate) => {
    setOperationData(prev => ({
      ...prev,
      currentRate: newRate,
      priceUpdated: true
    }));
  };

  // Calcular el tipo de cambio congelado
  const getFrozenRate = () => {
    const { fromCurrency, currentRate, buyPercent, sellPercent } = operationData;
    
    if (fromCurrency === 'PEN') {
      // Enviando soles, usar precio de venta
      return (currentRate * sellPercent).toFixed(3);
    } else {
      // Enviando dólares, usar precio de compra
      return (currentRate * buyPercent).toFixed(3);
    }
  };

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
          <TransactionSummary
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
    </Box>
  );
};

export default OperationFlowPage; 