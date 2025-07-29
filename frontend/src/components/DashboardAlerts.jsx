import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, Grow, Switch, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DolarHoyChart from './DolarHoyChart';
import api from '../services/api';

const DashboardAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const [showContent, setShowContent] = useState(false);
  // Estados para el formulario visual
  const [buyActive, setBuyActive] = useState(false);
  const [sellActive, setSellActive] = useState(false);
  const [buyValue, setBuyValue] = useState('');
  const [sellValue, setSellValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (e) {
      setAlerts([]);
    }
  };

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
    loadAlerts();
  }, []);

  const handleApply = async () => {
    setError('');
    if (!buyActive && !sellActive) {
      setError('Activa al menos una alerta para guardar.');
      return;
    }
    setLoading(true);
    try {
      if (buyActive && buyValue) {
        console.log('Enviando alerta de compra:', { type: 'sell', value: parseFloat(buyValue) });
        await api.post('/alerts', { type: 'sell', value: parseFloat(buyValue) });
      }
      if (sellActive && sellValue) {
        console.log('Enviando alerta de venta:', { type: 'buy', value: parseFloat(sellValue) });
        await api.post('/alerts', { type: 'buy', value: parseFloat(sellValue) });
      }
      setBuyValue('');
      setSellValue('');
      setBuyActive(false);
      setSellActive(false);
      loadAlerts();
    } catch (e) {
      console.error('Error completo:', e);
      console.error('Respuesta del servidor:', e.response?.data);
      setError(e.response?.data?.message || 'Error al guardar la alerta.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (alert) => setEditingAlert(alert);
  const closeEditModal = () => setEditingAlert(null);
  const handleDelete = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      loadAlerts();
    } catch (e) {
      console.error('Error al eliminar alerta:', e);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingAlert || !editingAlert.value) return;
    
    try {
      await api.put(`/alerts/${editingAlert.id}`, { value: parseFloat(editingAlert.value) });
      closeEditModal();
      loadAlerts();
    } catch (e) {
      console.error('Error al actualizar alerta:', e);
    }
  };

  // Función segura para formatear valores numéricos
  const formatValue = (value) => {
    if (value === null || value === undefined) return '';
    const numValue = parseFloat(value);
    return isNaN(numValue) ? '' : numValue.toFixed(3);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f8f9fa', p: { xs: 1, md: 4 } }}>
      <Fade in={showContent} timeout={800}>
        <Box>
          <Grow in={showContent} timeout={1000}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4, maxWidth: 900, mx: 'auto' }}>
              {/* Contenedor principal con formulario y gráfico */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start', mb: 3 }}>
                {/* Formulario visual */}
                <Box sx={{ flex: 1, minWidth: 320 }}>
                  {/* Primera alerta */}
                  <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', mb: 2 }}>
                    <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 16, mb: 2, color: '#222', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700 }}>Quiero dólares</span>, avísame cuando el dólar sea menor a:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TextField
                        value={buyValue}
                        onChange={e => setBuyValue(e.target.value.replace(/[^0-9.]/g, '').replace(/^([0-9]+\.[0-9]{0,3}).*$/, '$1'))}
                        placeholder="3.558"
                        disabled={!buyActive}
                        sx={{ 
                          flex: 1,
                          bgcolor: '#f9f9f9', 
                          borderRadius: 2, 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '& input': { 
                              textAlign: 'center', 
                              fontSize: 20, 
                              fontWeight: 500, 
                              fontFamily: 'Roboto, sans-serif', 
                              p: 1.5 
                            }
                          }
                        }}
                        inputProps={{ maxLength: 6 }}
                      />
                      <Switch 
                        checked={buyActive} 
                        onChange={e => setBuyActive(e.target.checked)} 
                        color="primary" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Box>
                  
                  {/* Segunda alerta */}
                  <Box sx={{ bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 400, fontSize: 16, mb: 2, color: '#222', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700 }}>Tengo dólares</span>, avísame cuando el dólar sea mayor a:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TextField
                        value={sellValue}
                        onChange={e => setSellValue(e.target.value.replace(/[^0-9.]/g, '').replace(/^([0-9]+\.[0-9]{0,3}).*$/, '$1'))}
                        placeholder="3.523"
                        disabled={!sellActive}
                        sx={{ 
                          flex: 1,
                          bgcolor: '#f9f9f9', 
                          borderRadius: 2, 
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' },
                            '& input': { 
                              textAlign: 'center', 
                              fontSize: 20, 
                              fontWeight: 500, 
                              fontFamily: 'Roboto, sans-serif', 
                              p: 1.5 
                            }
                          }
                        }}
                        inputProps={{ maxLength: 6 }}
                      />
                      <Switch 
                        checked={sellActive} 
                        onChange={e => setSellActive(e.target.checked)} 
                        color="primary" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Gráfico compacto */}
                <Box sx={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
                  <DolarHoyChart compact />
                </Box>
              </Box>

              {/* Botón centrado entre las secciones */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#b6f2e1',
                    color: '#333',
                    fontWeight: 700,
                    fontSize: 20,
                    borderRadius: 2,
                    px: 6,
                    py: 1.5,
                    textTransform: 'uppercase',
                    fontFamily: 'Roboto, sans-serif',
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                    '&:hover': { bgcolor: '#a0e6d1' },
                  }}
                  size="large"
                  onClick={handleApply}
                  disabled={loading || (!buyActive && !sellActive)}
                >
                  APLICAR
                </Button>
              </Box>

              {error && (
                <Typography color="error" sx={{ mt: 1, textAlign: 'center', mb: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>
          </Grow>

          {/* Historial de alertas */}
          <Grow in={showContent} timeout={1200}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: 900, mx: 'auto' }}>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 20, mb: 2, color: '#222' }}>
                Historial de alertas
              </Typography>
              <TableContainer sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(5,124,57,0.06)', mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#057c39', fontFamily: 'Roboto, sans-serif', fontSize: 15 }}>Fecha</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#057c39', fontFamily: 'Roboto, sans-serif', fontSize: 15 }}>Compra</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#057c39', fontFamily: 'Roboto, sans-serif', fontSize: 15 }}>Venta</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#057c39', fontFamily: 'Roboto, sans-serif', fontSize: 15, textAlign: 'center' }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map(alert => (
                      <TableRow
                        key={alert.id}
                        sx={{
                          bgcolor: '#fff',
                          borderRadius: 2,
                          boxShadow: '0 1px 4px rgba(5,124,57,0.03)',
                          transition: 'box-shadow 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 16px rgba(5,124,57,0.10)',
                            bgcolor: '#f0f7f4',
                          },
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, color: '#333' }}>{new Date(alert.createdAt).toLocaleDateString('es-PE')}</TableCell>
                        <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, color: alert.type === 'buy' ? '#057c39' : '#bbb', fontSize: 16 }}>
                          {alert.type === 'buy' ? formatValue(alert.value) : ''}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, color: alert.type === 'sell' ? '#e67e22' : '#bbb', fontSize: 16 }}>
                          {alert.type === 'sell' ? formatValue(alert.value) : ''}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton onClick={() => handleEdit(alert)} sx={{ color: '#057c39', mx: 0.5 }}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(alert.id)} sx={{ color: '#ff4757', mx: 0.5 }}><DeleteIcon /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grow>

          {/* Modal de edición */}
          <Dialog open={!!editingAlert} onClose={closeEditModal} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: '#057c39', fontFamily: 'Roboto, sans-serif' }}>Editar alerta</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500, fontSize: 16, mb: 1 }}>
                  Edita el valor de la alerta:
                </Typography>
                <TextField
                  label={editingAlert?.type === 'buy' ? 'Compra' : 'Venta'}
                  value={editingAlert?.value ? formatValue(editingAlert.value) : ''}
                  onChange={e => setEditingAlert({ 
                    ...editingAlert, 
                    value: e.target.value.replace(/[^0-9.]/g, '').replace(/^([0-9]+\.[0-9]{0,3}).*$/, '$1') 
                  })}
                  sx={{ bgcolor: '#f9f9f9', borderRadius: 2, width: 180, input: { textAlign: 'center', fontSize: 22, fontWeight: 500, fontFamily: 'Roboto, sans-serif', p: 1.5 } }}
                  inputProps={{ maxLength: 6 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditModal} color="inherit">Cancelar</Button>
              <Button onClick={handleSaveEdit} color="primary" variant="contained">Guardar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardAlerts; 