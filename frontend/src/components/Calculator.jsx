import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const API_RATE = '/api/rates/current';
const API_MARGINS = '/api/admin/public-margins';

const Calculator = ({ overrideBuyPercent, overrideSellPercent, swap }) => {
  const [rate, setRate] = useState(null);
  const [buyPercent, setBuyPercent] = useState(1);
  const [sellPercent, setSellPercent] = useState(1);
  const [pen, setPen] = useState('');
  const [usd, setUsd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rateRes, marginsRes] = await Promise.all([
          axios.get(API_RATE),
          axios.get(API_MARGINS),
        ]);
        setRate(rateRes.data.rate);
        setBuyPercent(marginsRes.data.buyPercent || 1);
        setSellPercent(marginsRes.data.sellPercent || 1);
        setLoading(false);
      } catch (err) {
        setError('No se pudo obtener la tasa de cambio.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Si se pasan overrides desde el admin, usarlos
  const buy = overrideBuyPercent !== undefined ? overrideBuyPercent : buyPercent;
  const sell = overrideSellPercent !== undefined ? overrideSellPercent : sellPercent;

  // Conversión PEN a USD (usando precio de compra)
  const handlePenChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPen(value);
    if (rate && value) {
      setUsd((parseFloat(value) / (rate * buy)).toFixed(2));
    } else {
      setUsd('');
    }
  };

  // Conversión USD a PEN (usando precio de venta)
  const handleUsdChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUsd(value);
    if (rate && value) {
      setPen((parseFloat(value) * rate * sell).toFixed(2));
    } else {
      setPen('');
    }
  };

  // Swap: invierte los campos y la lógica
  const isSwapped = !!swap;

  const precioCompra = rate ? (rate * buy).toFixed(4) : '';
  const precioVenta = rate ? (rate * sell).toFixed(4) : '';

  return (
    <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, background: 'white', minWidth: 320 }}>
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
            <b>Precio de compra:</b> 1 USD = {precioCompra} PEN<br />
            <b>Precio de venta:</b> 1 USD = {precioVenta} PEN
          </Typography>
          <Grid container spacing={2} alignItems="center">
            {isSwapped ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monto en Dólares (USD)"
                    variant="outlined"
                    fullWidth
                    value={usd}
                    onChange={handleUsdChange}
                    inputProps={{ inputMode: 'decimal' }}
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monto en Soles (PEN)"
                    variant="outlined"
                    fullWidth
                    value={pen}
                    onChange={handlePenChange}
                    inputProps={{ inputMode: 'decimal' }}
                    autoComplete="off"
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monto en Soles (PEN)"
                    variant="outlined"
                    fullWidth
                    value={pen}
                    onChange={handlePenChange}
                    inputProps={{ inputMode: 'decimal' }}
                    autoComplete="off"
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
                    autoComplete="off"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Calculator; 
 