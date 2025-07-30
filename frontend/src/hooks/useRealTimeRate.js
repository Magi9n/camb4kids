import { useState, useEffect } from 'react';
import socketService from '../services/socket';

export const useRealTimeRate = () => {
  const [currentRate, setCurrentRate] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar al WebSocket
    socketService.connect();

    // Función para manejar actualizaciones del tipo de cambio
    const handleRateUpdate = (newRate) => {
      setCurrentRate(newRate);
    };

    // Función para manejar cambios de conexión
    const handleConnectionChange = () => {
      setIsConnected(socketService.isConnected());
    };

    // Suscribirse a eventos
    socketService.on('rateUpdate', handleRateUpdate);
    
    // Verificar estado de conexión inicial
    handleConnectionChange();

    // Limpiar al desmontar
    return () => {
      socketService.off('rateUpdate', handleRateUpdate);
    };
  }, []);

  // Aplicar margen del 100% (1.0) al tipo de cambio
  const getRateWithMargin = (type = 'buy') => {
    if (!currentRate) return null;
    
    // Por ahora el margen es 1.0 (100%) para compra y venta
    // En el futuro esto será configurable desde el admin
    const margin = 1.0;
    
    return currentRate * margin;
  };

  return {
    currentRate,
    rateWithMargin: getRateWithMargin(),
    isConnected,
    getRateWithMargin,
  };
}; 