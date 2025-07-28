import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
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

export default api; 
 