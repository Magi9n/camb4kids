import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../services/api';

const CURRENCIES = [
  { value: 'USD', label: 'Dólares (USD)' },
  { value: 'PEN', label: 'Soles (PEN)' },
];

const OrderForm = ({ onOrderCreated }) => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PEN');
  const [rate, setRate] = useState(null);
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Obtener la tasa actual
    const fetchRate = async () => {
      try {
        const res = await api.get('/rates/current');
        setRate(res.data.rate);
      } catch (err) {
        setError('No se pudo obtener la tasa de cambio.');
      }
    };
    
    // Cargar datos iniciales
    fetchRate();
    
    // Actualizar cada 5 segundos
    const interval = setInterval(fetchRate, 5000);
    
    // Limpiar intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calcular el total automáticamente
    if (amount && rate) {
      if (fromCurrency === 'USD' && toCurrency === 'PEN') {
        setTotal((parseFloat(amount) * rate).toFixed(2));
      } else if (fromCurrency === 'PEN' && toCurrency === 'USD') {
        setTotal((parseFloat(amount) / rate).toFixed(2));
      } else {
        setTotal('');
      }
    } else {
      setTotal('');
    }
  }, [amount, fromCurrency, toCurrency, rate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Ingresa un monto válido.');
      return;
    }
    if (fromCurrency === toCurrency) {
      setError('Las monedas deben ser diferentes.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/orders', {
        amount: parseFloat(amount),
        fromCurrency,
        toCurrency,
      });
      setSuccess('¡Orden creada exitosamente!');
      setAmount('');
      setTotal('');
      if (onOrderCreated) onOrderCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la orden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, background: 'white', mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Crear nueva orden de cambio
      </Typography>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextField
          label="Monto"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, step: 'any' }}
          required
        />
        <TextField
          select
          label="De"
          value={fromCurrency}
          onChange={e => setFromCurrency(e.target.value)}
          fullWidth
          margin="normal"
        >
          {CURRENCIES.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="A"
          value={toCurrency}
          onChange={e => setToCurrency(e.target.value)}
          fullWidth
          margin="normal"
        >
          {CURRENCIES.map(option => (
            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
          ))}
        </TextField>
        {rate && (
          <Typography sx={{ mt: 2 }}>
            Tasa actual: <b>1 USD = {rate} PEN</b>
          </Typography>
        )}
        {total && (
          <Typography sx={{ mt: 1 }}>
            <b>Total a recibir: {total} {toCurrency}</b>
          </Typography>
        )}
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Crear orden'}
        </Button>
      </form>
    </Box>
  );
};

export default OrderForm; 