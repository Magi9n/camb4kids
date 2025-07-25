import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import peruFlag from '../assets/peru.svg';
import usaFlag from '../assets/USA.svg';

const API_RATE = '/api/rates/current';
const API_MARGINS = '/api/admin/public-margins';

const Calculator = ({ overrideBuyPercent, overrideSellPercent, swap, onSwap, swapActive, onPenChange }) => {
  const [rate, setRate] = useState(null);
  const [buyPercent, setBuyPercent] = useState(1);
  const [sellPercent, setSellPercent] = useState(1);
  const [pen, setPen] = useState('1000');
  const [usd, setUsd] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState('send');

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

  // Notificar al padre cada vez que pen cambie
  useEffect(() => {
    if (typeof onPenChange === 'function') {
      onPenChange(pen);
    }
  }, [pen, onPenChange]);

  const buy = overrideBuyPercent !== undefined ? overrideBuyPercent : buyPercent;
  const sell = overrideSellPercent !== undefined ? overrideSellPercent : sellPercent;
  const isSwapped = !!swap;

  // Calcular automáticamente el equivalente en dólares al cargar la página si pen tiene valor y no está en modo swap
  useEffect(() => {
    if (!isSwapped && rate && pen && usd === '') {
      setUsd((parseFloat(pen) / (rate * buy)).toFixed(2));
    }
    if (isSwapped && rate && usd && pen === '') {
      setPen((parseFloat(usd) * rate * sell).toFixed(2));
    }
  }, [rate, buy, sell, pen, usd, isSwapped]);

  // Lógica de conversión
  const limitToTwoDecimals = (val) => {
    // Permite solo dos decimales
    if (!val) return '';
    const match = val.match(/^\d*(\.\d{0,2})?/);
    return match ? match[0] : '';
  };

  const handleSendChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    value = limitToTwoDecimals(value);
    setEditing('send');
    if (isSwapped) {
      setUsd(value);
      if (rate && value) {
        setPen((parseFloat(value) * rate * sell).toFixed(2));
      } else {
        setPen('');
      }
    } else {
      setPen(value);
      if (rate && value) {
        setUsd((parseFloat(value) / (rate * buy)).toFixed(2));
      } else {
        setUsd('');
      }
    }
  };
  const handleReceiveChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    value = limitToTwoDecimals(value);
    setEditing('receive');
    if (isSwapped) {
      setPen(value);
      if (rate && value) {
        setUsd((parseFloat(value) / (rate * buy)).toFixed(2));
      } else {
        setUsd('');
      }
    } else {
      setUsd(value);
      if (rate && value) {
        setPen((parseFloat(value) * rate * sell).toFixed(2));
      } else {
        setPen('');
      }
    }
  };

  // Textos y colores según swap
  const sendLabel = isSwapped ? 'Enví­as dólares' : 'Enví­as soles';
  const receiveLabel = isSwapped ? 'Recibes soles' : 'Recibes dólares';
  const sendValue = isSwapped ? usd : pen;
  const receiveValue = isSwapped ? pen : usd;
  const sendCurrency = isSwapped ? '$' : 'S/';
  const receiveCurrency = isSwapped ? 'S/' : '$';
  const sendFlag = isSwapped ? usaFlag : peruFlag;
  const receiveFlag = isSwapped ? peruFlag : usaFlag;
  const sendOnChange = handleSendChange;
  const receiveOnChange = handleReceiveChange;
  const receiveColor = '#49b87a';
  const sendColor = '#fff';
  const labelColor = '#057c39';
  const valueColor = '#057c39';

  const precioCompra = rate ? (rate * buy).toFixed(4) : '';
  const precioVenta = rate ? (rate * sell).toFixed(4) : '';

  return (
    <Box sx={{ width: 400, maxWidth: '100%', background: 'transparent', fontFamily: 'Roboto, sans-serif', mx: 'auto' }}>
      {/* Bloque de precios superior */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 5, width: '100%' }}>
        <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#222', fontSize: 18, textAlign: 'center', lineHeight: 1 }}>
            Compramos:
          </Typography>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#222', fontSize: 16, textAlign: 'center', lineHeight: 1, mt: 0.5 }}>
            {precioCompra || '--'}
          </Typography>
        </Box>
        <Box sx={{ flex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, color: '#222', fontSize: 18, textAlign: 'center', lineHeight: 1 }}>
            Vendemos:
          </Typography>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, color: '#222', fontSize: 16, textAlign: 'center', lineHeight: 1, mt: 0.5 }}>
            {precioVenta || '--'}
          </Typography>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Bloque superior: Enví­as */}
          <Box sx={{
            background: sendColor,
            borderRadius: 999,
            px: 3,
            py: 0.7,
            width: '92%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
            minHeight: 62,
            position: 'relative',
            zIndex: 2,
            mb: 1.2,
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
              <Typography sx={{ color: labelColor, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 16, mb: 0.2, lineHeight: 1 }}>{sendLabel}</Typography>
              <TextField
                variant="standard"
                value={sendValue}
                onChange={sendOnChange}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontWeight: 900,
                    fontSize: 32,
                    color: valueColor,
                    fontFamily: 'Roboto, sans-serif',
                    background: 'transparent',
                  },
                  inputMode: 'decimal',
                  autoComplete: 'off',
                }}
                sx={{ width: 180, background: 'transparent', mt: 0 }}
                placeholder="0.00"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <img src={sendFlag} alt="flag" style={{ height: 22, width: 'auto', marginRight: 4 }} />
              <Typography sx={{ color: valueColor, fontWeight: 900, fontFamily: 'Roboto, sans-serif', fontSize: 26 }}>
                {sendCurrency}
              </Typography>
            </Box>
          </Box>
          {/* Swap funcional superpuesto */}
          <Box sx={{ position: 'absolute', left: '65%', top: 'calc(50% + 2px)', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <Box
              onClick={onSwap}
              sx={{
                background: '#111',
                borderRadius: '50%',
                width: 54,
                height: 54,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                cursor: 'pointer',
                transition: 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                transform: swapActive ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                zIndex: 10,
              }}
            >
              <SwapVertIcon sx={{ color: '#fff', fontSize: 30, transition: 'color 0.2s' }} />
            </Box>
          </Box>
          {/* Bloque inferior: Recibes */}
          <Box sx={{
            background: 'rgba(73,184,122,0.26)',
            borderRadius: 999,
            px: 3,
            py: 0.7,
            width: '92%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 62,
            mt: 1.2,
            position: 'relative',
            zIndex: 1,
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', ml: 2 }}>
              <Typography sx={{ color: labelColor, fontWeight: 700, fontFamily: 'Roboto, sans-serif', fontSize: 16, mb: 0.2, lineHeight: 1 }}>{receiveLabel}</Typography>
              <TextField
                variant="standard"
                value={receiveValue}
                onChange={receiveOnChange}
                InputProps={{
                  disableUnderline: true,
                  style: {
                    fontWeight: 900,
                    fontSize: 32,
                    color: valueColor,
                    fontFamily: 'Roboto, sans-serif',
                    background: 'transparent',
                  },
                  inputMode: 'decimal',
                  autoComplete: 'off',
                }}
                sx={{ width: 180, background: 'transparent', mt: 0 }}
                placeholder="0.00"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <img src={receiveFlag} alt="flag" style={{ height: 22, width: 'auto', marginRight: 4 }} />
              <Typography sx={{ color: valueColor, fontWeight: 900, fontFamily: 'Roboto, sans-serif', fontSize: 26 }}>
                {receiveCurrency}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Calculator; 
 