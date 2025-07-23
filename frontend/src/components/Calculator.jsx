import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

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

  const buy = overrideBuyPercent !== undefined ? overrideBuyPercent : buyPercent;
  const sell = overrideSellPercent !== undefined ? overrideSellPercent : sellPercent;
  const isSwapped = !!swap;

  // Lógica de conversión
  const handlePenChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setPen(value);
    if (rate && value) {
      setUsd((parseFloat(value) / (rate * buy)).toFixed(2));
    } else {
      setUsd('');
    }
  };
  const handleUsdChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setUsd(value);
    if (rate && value) {
      setPen((parseFloat(value) * rate * sell).toFixed(2));
    } else {
      setPen('');
    }
  };

  // Textos y colores según swap
  const sendLabel = isSwapped ? 'Enví­as dólares' : 'Enví­as soles';
  const receiveLabel = isSwapped ? 'Recibes soles' : 'Recibes dólares';
  const sendValue = isSwapped ? usd : pen;
  const receiveValue = isSwapped ? pen : usd;
  const sendCurrency = isSwapped ? '$' : 'S/';
  const receiveCurrency = isSwapped ? 'S/' : '$';
  const sendOnChange = isSwapped ? handleUsdChange : handlePenChange;
  const receiveColor = '#49b87a';
  const sendColor = '#fff';
  const labelColor = '#057c39';
  const valueColor = '#057c39';

  const precioCompra = rate ? (rate * buy).toFixed(4) : '';
  const precioVenta = rate ? (rate * sell).toFixed(4) : '';

  return (
    <Box sx={{ width: 370, maxWidth: '100%', background: 'transparent', fontFamily: 'Roboto, sans-serif' }}>
      <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#222', fontSize: 16, textAlign: 'center', mb: 1 }}>
        <span>Compramos: <b>{precioCompra}</b></span> &nbsp; &nbsp; <span>Vendemos: <b>{precioVenta}</b></span>
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ position: 'relative', width: '100%' }}>
          {/* Bloque superior: Enví­as */}
          <Box sx={{
            background: sendColor,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            px: 4,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
          }}>
            <Box>
              <Typography sx={{ color: labelColor, fontWeight: 500, fontFamily: 'Roboto, sans-serif', fontSize: 18, mb: 0.5 }}>{sendLabel}</Typography>
              <TextField
                variant="standard"
                value={sendValue}
                onChange={sendOnChange}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontWeight: 700,
                    fontSize: 28,
                    color: valueColor,
                    fontFamily: 'Roboto, sans-serif',
                    background: 'transparent',
                  },
                  inputMode: 'decimal',
                  autoComplete: 'off',
                }}
                sx={{ width: 140, background: 'transparent', mt: 0.5 }}
                placeholder="0.00"
              />
            </Box>
            <Typography sx={{ color: valueColor, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 36, ml: 2 }}>
              {sendCurrency}
            </Typography>
          </Box>
          {/* Botón swap centrado */}
          <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
            <Box sx={{ background: '#222', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)' }}>
              <CurrencyExchangeIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>
          </Box>
          {/* Bloque inferior: Recibes */}
          <Box sx={{
            background: receiveColor,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            px: 4,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}>
            <Box>
              <Typography sx={{ color: labelColor, fontWeight: 500, fontFamily: 'Roboto, sans-serif', fontSize: 18, mb: 0.5 }}>{receiveLabel}</Typography>
              <TextField
                variant="standard"
                value={receiveValue}
                disabled
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontWeight: 700,
                    fontSize: 28,
                    color: valueColor,
                    fontFamily: 'Roboto, sans-serif',
                    background: 'transparent',
                  },
                  inputMode: 'decimal',
                  autoComplete: 'off',
                }}
                sx={{ width: 140, background: 'transparent', mt: 0.5 }}
                placeholder="0.00"
              />
            </Box>
            <Typography sx={{ color: valueColor, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 36, ml: 2 }}>
              {receiveCurrency}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Calculator; 
 