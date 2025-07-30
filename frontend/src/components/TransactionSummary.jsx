import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import CountdownTimer from './CountdownTimer';
import { useRealTimeRate } from '../hooks/useRealTimeRate';
import api from '../services/api';

const TransactionSummary = ({ operationData, onPriceUpdate }) => {
  const { currentRate, rateWithMargin, isConnected } = useRealTimeRate();
  const [priceUpdated, setPriceUpdated] = useState(false);

  // Usar el tipo de cambio en tiempo real con margen aplicado
  const rate = rateWithMargin || operationData.currentRate || operationData.rate;

  // Calcular montos según el tipo de cambio actualizado
  const calculateAmounts = () => {
    const { amount, fromCurrency, toCurrency, buyPercent, sellPercent } = operationData;
    
    if (fromCurrency === 'PEN' && toCurrency === 'USD') {
      // Enviando soles, recibiendo dólares
      const receivedAmount = (parseFloat(amount) / (rate * buyPercent)).toFixed(2);
      return {
        send: `${parseFloat(amount).toFixed(2)} S/`,
        receive: `$${receivedAmount}`,
        rateUsed: (rate * buyPercent).toFixed(3)
      };
    } else {
      // Enviando dólares, recibiendo soles
      const receivedAmount = (parseFloat(amount) * rate * sellPercent).toFixed(2);
      return {
        send: `$${parseFloat(amount).toFixed(2)}`,
        receive: `${receivedAmount} S/`,
        rateUsed: (rate * sellPercent).toFixed(3)
      };
    }
  };

  const amounts = calculateAmounts();

  // Función para actualizar precio cuando expire el timer
  const handleTimerExpired = async () => {
    try {
      // Obtener el tipo de cambio más reciente
      const [rateRes, marginsRes] = await Promise.all([
        api.get('/rates/current'),
        api.get('/admin/public-margins')
      ]);

      const newRate = rateRes.data.rate;
      const { buyPercent, sellPercent } = marginsRes.data;

      // Aplicar margen del 100% (1.0)
      const newRateWithMargin = newRate * 1.0;

      setPriceUpdated(true);
      onPriceUpdate(newRateWithMargin);

      console.log('Precio actualizado:', {
        newRate,
        newRateWithMargin,
        buyPercent,
        sellPercent,
        fromCurrency: operationData.fromCurrency,
        toCurrency: operationData.toCurrency
      });
    } catch (error) {
      console.error('Error actualizando precio:', error);
    }
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          color: '#333',
          mb: 2
        }}
      >
        Resumen de tu operación
      </Typography>

      {/* Cronómetro */}
      <Box sx={{ mb: 3 }}>
        <CountdownTimer 
          duration={4 * 60} // 4 minutos en segundos
          onExpired={handleTimerExpired}
        />
      </Box>

      {/* Indicador de conexión en tiempo real */}
      {isConnected && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 2,
          p: 1,
          bgcolor: '#e8f5e8',
          borderRadius: 1,
          border: '1px solid #4caf50'
        }}>
          <Box sx={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: '#4CAF50',
            animation: 'pulse 2s infinite'
          }} />
          <Typography sx={{ 
            fontSize: 12, 
            color: '#2e7d32', 
            fontWeight: 500,
            fontFamily: 'Roboto, sans-serif'
          }}>
            Tipo de cambio en tiempo real
          </Typography>
        </Box>
      )}

      {/* Resumen de transacción */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
            Tu envías
          </Typography>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
            {amounts.send}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
            Tu recibes
          </Typography>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
            {amounts.receive}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
            Manguitos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 18 }}>
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

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
            Tipo de cambio utilizado
          </Typography>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700 }}>
            {amounts.rateUsed}
          </Typography>
        </Box>
      </Paper>

      {/* Alerta de precio actualizado */}
      {priceUpdated && (
        <Paper sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: '#e8f5e8',
          border: '1px solid #4caf50'
        }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif',
            color: '#2e7d32',
            fontWeight: 500
          }}>
            ⚠️ El precio ha sido actualizado con el tipo de cambio más reciente.
          </Typography>
        </Paper>
      )}

      {/* Información de cuentas */}
      {operationData.fromAccount && operationData.toAccount && (
        <Paper sx={{ 
          p: 3, 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          mt: 3
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333',
              mb: 2
            }}
          >
            Cuentas seleccionadas
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                Cuenta origen:
              </Typography>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                {operationData.fromAccount.bank} - {operationData.fromAccount.accountNumber}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#666' }}>
                Cuenta destino:
              </Typography>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600 }}>
                {operationData.toAccount.bank} - {operationData.toAccount.accountNumber}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default TransactionSummary; 