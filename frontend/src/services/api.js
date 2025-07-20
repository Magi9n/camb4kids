import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Cambia esto si tu backend está en otro host
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api; 