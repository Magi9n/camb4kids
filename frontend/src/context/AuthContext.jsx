import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar token y usuario del sessionStorage al iniciar
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken && savedUser) {
      // Verificar si el token es válido con el backend
      const verifyToken = async () => {
        try {
          // Configurar el token en el header para la verificación
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
          // Hacer una petición al backend para verificar el token
          const response = await api.get('/auth/verify');
          
          if (response.status === 200) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
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

      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

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
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    // Remover el token del header de la API
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
 