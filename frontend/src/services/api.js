import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Interceptor para agregar el header de la API key en cada petición
api.interceptors.request.use((config) => {
  const apiKey = process.env.REACT_APP_PUBLIC_API_SECRET;
  console.log('🔑 API Key from env:', apiKey ? 'EXISTS' : 'NOT FOUND');
  console.log('🔑 API Key length:', apiKey ? apiKey.length : 0);
  console.log('🔑 API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A');
  
  if (apiKey) {
    config.headers['x-public-api-key'] = apiKey;
    console.log('✅ Header x-public-api-key added');
  } else {
    console.log('❌ No API key found in environment');
  }
  
  console.log('🌐 Request URL:', config.url);
  console.log('📋 Request headers:', config.headers);
  
  return config;
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use((config) => {
  const user = sessionStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  if (token && user) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar sesión
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Redirigir al login solo si no estamos ya en la página de login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const registrarOperacion = (data) => api.post('/operations', data);

export default api; 
 