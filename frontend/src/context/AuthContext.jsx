import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(true);

  // Función para verificar el token
  const verifyToken = async () => {
    try {
      const response = await api.get('/auth/verify');
      if (response.status !== 200) {
        logout();
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      logout();
    }
  };

  // Función para verificar el estado del perfil
  const checkProfileStatus = async () => {
    try {
      console.log('[DEBUG] Verificando estado del perfil...');
      const response = await api.get('/auth/profile-status');
      console.log('[DEBUG] Respuesta del perfil:', response.data);
      setProfileComplete(response.data.isComplete);
      return response.data.isComplete;
    } catch (error) {
      console.error('Error verificando estado del perfil:', error);
      return false;
    }
  };

  useEffect(() => {
    // Cargar token y usuario del sessionStorage al iniciar
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken && savedUser) {
      // Verificar si el token es válido con el backend
      const initialVerify = async () => {
        try {
          // Configurar el token en el header para la verificación
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Hacer una petición al backend para verificar el token
          const response = await api.get('/auth/verify');
          
          if (response.status === 200) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            
            // Verificar el estado del perfil
            const isProfileComplete = await checkProfileStatus();
            setProfileComplete(isProfileComplete);
            
            // Si el perfil no está completado y no estamos en la página de completar perfil, redirigir
            if (!isProfileComplete && window.location.pathname !== '/complete-profile') {
              window.location.href = `/complete-profile?email=${JSON.parse(savedUser).email}`;
            }
          } else {
            // Token inválido, limpiar datos
            logout();
          }
        } catch (error) {
          console.error('Error verificando token:', error);
          // Token inválido o error de red, limpiar datos
          logout();
        } finally {
          setLoading(false);
        }
      };

      initialVerify();
    } else {
      setLoading(false);
    }
  }, []);

  // Verificación periódica del token cada 5 minutos
  useEffect(() => {
    if (token) {
      const interval = setInterval(async () => {
        await verifyToken();
        // También verificar el estado del perfil periódicamente
        await checkProfileStatus();
      }, 5 * 60 * 1000); // 5 minutos
      return () => clearInterval(interval);
    }
  }, [token]);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    sessionStorage.setItem('token', jwt);
    sessionStorage.setItem('user', JSON.stringify(userData));
    // Configurar el token en el header de la API
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setProfileComplete(true);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Remover el token del header de la API
    delete api.defaults.headers.common['Authorization'];
    
    // Redirigir al login si no estamos ya ahí
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, profileComplete, checkProfileStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
 