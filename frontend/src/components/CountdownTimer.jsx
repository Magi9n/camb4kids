import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { AccessTime as AccessTimeIcon } from '@mui/icons-material';

const CountdownTimer = ({ duration = 240, onExpired, size = 'normal' }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      if (onExpired) {
        onExpired();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpired]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (timeLeft > 120) return '#4caf50'; // Verde
    if (timeLeft > 60) return '#ff9800'; // Naranja
    return '#f44336'; // Rojo
  };

  const getProgressValue = () => {
    return ((duration - timeLeft) / duration) * 100;
  };

  // Configuraciones según el tamaño
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          paperPadding: 1,
          iconSize: 16,
          progressSize: 32,
          progressThickness: 3,
          titleVariant: 'body2',
          subtitleVariant: 'caption',
          timeVariant: 'body2'
        };
      case 'large':
        return {
          paperPadding: 4,
          iconSize: 32,
          progressSize: 80,
          progressThickness: 5,
          titleVariant: 'h5',
          subtitleVariant: 'body1',
          timeVariant: 'h4'
        };
      default: // normal
        return {
          paperPadding: 3,
          iconSize: 28,
          progressSize: 60,
          progressThickness: 4,
          titleVariant: 'h6',
          subtitleVariant: 'body2',
          timeVariant: 'h6'
        };
    }
  };

  const config = getSizeConfig();

  // Si es tamaño pequeño, mostrar solo el cronómetro sin texto
  if (size === 'small') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={getProgressValue()}
            size={config.progressSize}
            thickness={config.progressThickness}
            sx={{
              color: getProgressColor(),
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant={config.timeVariant}
              component="div"
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                color: getProgressColor(),
                fontSize: 10
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Paper sx={{ 
      p: config.paperPadding, 
      borderRadius: 3, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      bgcolor: isExpired ? '#fff3e0' : '#fff',
      border: isExpired ? '2px solid #ff9800' : 'none'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <AccessTimeIcon sx={{ color: getProgressColor(), fontSize: config.iconSize }} />
        
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={getProgressValue()}
            size={config.progressSize}
            thickness={config.progressThickness}
            sx={{
              color: getProgressColor(),
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant={config.timeVariant}
              component="div"
              sx={{ 
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                color: getProgressColor()
              }}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography 
            variant={config.titleVariant}
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              color: '#333'
            }}
          >
            {isExpired ? 'Tiempo agotado' : 'Tiempo restante'}
          </Typography>
          <Typography 
            variant={config.subtitleVariant}
            sx={{ 
              color: '#666',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            {isExpired 
              ? 'El precio ha sido actualizado' 
              : 'El precio se actualizará automáticamente'
            }
          </Typography>
        </Box>
      </Box>

      {isExpired && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: '#fff3e0', 
          borderRadius: 2,
          border: '1px solid #ff9800'
        }}>
          <Typography 
            sx={{ 
              fontFamily: 'Roboto, sans-serif',
              color: '#e65100',
              fontWeight: 500,
              textAlign: 'center'
            }}
          >
            ⚠️ El tipo de cambio ha sido actualizado con el precio más reciente
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CountdownTimer; 