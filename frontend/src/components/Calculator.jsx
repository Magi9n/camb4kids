import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const API_URL = 'http://localhost:3000/rates/current'; // Cambia esto si tu backend está en otro host

const Calculator = () => {
  const [rate, setRate] = useState(null);
  const [pen, setPen] = useState('');
  const [usd, setUsd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setRate(res.data.rate);
        setLoading(false);
      } catch (err) {
        setError('No se pudo obtener la tasa de cambio.');
        setLoading(false);
      }
    };
    fetchRate();
  }, []);

  // Conversión PEN a USD
  const handlePenChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPen(value);
    if (rate && value) {
      setUsd((parseFloat(value) / rate).toFixed(2));
    } else {
      setUsd('');
    }
  };

  // Conversión USD a PEN
  const handleUsdChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUsd(value);
    if (rate && value) {
      setPen((parseFloat(value) * rate).toFixed(2));
    } else {
      setPen('');
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, background: 'white' }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Calculadora de cambio en tiempo real
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Tasa actual: <b>1 USD = {rate} PEN</b>
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                label="Monto en Soles (PEN)"
                variant="outlined"
                fullWidth
                value={pen}
                onChange={handlePenChange}
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Monto en Dólares (USD)"
                variant="outlined"
                fullWidth
                value={usd}
                onChange={handleUsdChange}
                inputProps={{ inputMode: 'decimal' }}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Calculator; 
 