import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    // URL del backend - usar HTTP para evitar problemas de SSL
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : 'http://cambio.mate4kids.com';

    this.socket = io(backendUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      path: '/socket.io/',
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
    });

    this.socket.on('rateUpdate', (data) => {
      console.log('Nuevo tipo de cambio recibido:', data.rate);
      this.notifyListeners('rateUpdate', data.rate);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error en callback de WebSocket:', error);
        }
      });
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Instancia singleton
const socketService = new SocketService();

export default socketService; 