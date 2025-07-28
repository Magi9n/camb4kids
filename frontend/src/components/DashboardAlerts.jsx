import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, Grow } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DolarHoyChart from './DolarHoyChart';
import { AlertForm } from './AlertBlock';
import api from '../services/api';

const DashboardAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const [showContent, setShowContent] = useState(false);

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

  const handleEdit = (alert) => setEditingAlert(alert);
  const closeEditModal = () => setEditingAlert(null);
  const handleDelete = async (id) => {
    await api.delete(`/alerts/${id}`);
    loadAlerts();
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f8f9fa', p: { xs: 1, md: 4 } }}>
      <Fade in={showContent} timeout={800}>
        <Box>
          <Grow in={showContent} timeout={1000}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', mb: 4, maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'flex-start' }}>
              {/* Formulario de alertas */}
              <Box sx={{ flex: 1, minWidth: 320 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 22, mb: 2, color: '#222' }}>
                  Alertas de tipo de cambio
                </Typography>
                <AlertForm onSuccess={loadAlerts} />
              </Box>
              {/* Gráfico compacto */}
              <Box sx={{ flex: 1, minWidth: 320, maxWidth: 400 }}>
                <DolarHoyChart compact />
              </Box>
            </Paper>
          </Grow>

          {/* Historial de alertas */}
          <Grow in={showContent} timeout={1200}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: 900, mx: 'auto' }}>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 700, fontSize: 20, mb: 2, color: '#222' }}>
                Historial de alertas
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Compra</TableCell>
                      <TableCell>Venta</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alerts.map(alert => (
                      <TableRow key={alert.id}>
                        <TableCell>{new Date(alert.createdAt).toLocaleDateString('es-PE')}</TableCell>
                        <TableCell>{alert.type === 'buy' ? alert.value.toFixed(3) : ''}</TableCell>
                        <TableCell>{alert.type === 'sell' ? alert.value.toFixed(3) : ''}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleEdit(alert)}><EditIcon /></IconButton>
                          <IconButton onClick={() => handleDelete(alert.id)}><DeleteIcon /></IconButton>
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
              <AlertForm
                editing
                initialBuy={editingAlert?.type === 'buy' ? editingAlert.value.toString() : ''}
                initialSell={editingAlert?.type === 'sell' ? editingAlert.value.toString() : ''}
                onSuccess={() => { closeEditModal(); loadAlerts(); }}
                onCancel={closeEditModal}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={closeEditModal} color="inherit">Cancelar</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Box>
  );
};

export default DashboardAlerts; 