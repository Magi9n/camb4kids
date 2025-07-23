import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const API_URL = '/api/admin/settings';

const AdminPanel = () => {
  const [buyPercent, setBuyPercent] = useState('');
  const [sellPercent, setSellPercent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        setBuyPercent((res.data.buyPercent * 100).toString());
        setSellPercent((res.data.sellPercent * 100).toString());
        setLoading(false);
      } catch (err) {
        setError('No se pudo cargar la configuración.');
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await axios.put(API_URL, {
        buyPercent: parseFloat(buyPercent) / 100,
        sellPercent: parseFloat(sellPercent) / 100,
      });
      setSuccess(true);
    } catch (err) {
      setError('Error al guardar los márgenes.');
    }
    setSaving(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Panel Administrativo
      </Typography>
      <Typography variant="body1" mb={3}>
        Aquí podrás gestionar márgenes, ver órdenes y estadísticas del sistema.
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 400, mb: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Márgenes de compra y venta (%)
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="Porcentaje de compra (%)"
              type="number"
              value={buyPercent}
              onChange={e => setBuyPercent(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0, max: 200, step: 0.01 }}
            />
            <TextField
              label="Porcentaje de venta (%)"
              type="number"
              value={sellPercent}
              onChange={e => setSellPercent(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              inputProps={{ min: 0, max: 200, step: 0.01 }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={saving}
              fullWidth
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
            {success && <Typography color="success.main" mt={2}>¡Guardado!</Typography>}
            {error && <Typography color="error" mt={2}>{error}</Typography>}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AdminPanel; 
 