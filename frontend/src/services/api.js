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

export default api; 
 