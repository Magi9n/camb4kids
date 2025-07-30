import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Alert,
  Fade,
  Grow,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import peruFlag from '../assets/peru.svg';
import usaFlag from '../assets/USA.svg';
import bcpLogo from '../assets/bcp.svg';
import bbvaLogo from '../assets/bbva.svg';
import interbankLogo from '../assets/interbank.svg';
import scotiabankLogo from '../assets/scotiabank.svg';
import pichinchaLogo from '../assets/pichincha.svg';
import api from '../services/api';
import { Global } from '@emotion/react';
import Lottie from 'lottie-react';
import cuentasBankAnim from '../assets/cuentasbank.json';

// Componente para el Lottie
const LottieAnimation = () => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <Box sx={{ 
        width: 240, 
        height: 240, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mx: 'auto',
        bgcolor: '#f5f5f5',
        borderRadius: '50%'
      }}>
        <Typography sx={{ color: '#666', fontSize: 14 }}>
          🏦
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: 240, 
      height: 240, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      mx: 'auto' 
    }}>
      <Lottie 
        animationData={cuentasBankAnim} 
        loop={true} 
        style={{ width: '100%', height: '100%' }}
        onError={() => setHasError(true)}
      />
    </Box>
  );
};

const BankAccounts = ({ isModal = false, onAccountAdded }) => {
  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    accountType: '',
    bank: '',
    accountNumber: '',
    accountName: '',
    currency: 'soles',
    isMine: false
  });

  const banks = [
    { name: 'BCP', logo: bcpLogo },
    { name: 'BBVA', logo: bbvaLogo },
    { name: 'Interbank', logo: interbankLogo },
    { name: 'Scotiabank', logo: scotiabankLogo },
    { name: 'Banco Pichincha', logo: pichinchaLogo },
    { name: 'BanBif', logo: null },
    { name: 'Mi Banco', logo: null },
    { name: 'Banco Azteca', logo: null },
    { name: 'Banco Ripley', logo: null },
    { name: 'Banco Falabella', logo: null }
  ];

  const accountTypes = [
    'Cuenta Corriente',
    'Cuenta de Ahorros',
    'Cuenta Sueldo',
    'Cuenta Digital'
  ];

  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setTimeout(() => setShowContent(true), 300);
        await loadAccounts();
      } catch (error) {
        console.error('Error inicializando componente BankAccounts:', error);
        setShowContent(true); // Mostrar contenido incluso si hay error
      }
    };

    initializeComponent();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await api.get('/bank-accounts');
      if (response && response.data) {
        setAccounts(response.data);
      } else {
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error cargando cuentas:', error);
      setAccounts([]);
      // No mostrar snackbar aquí para evitar spam de errores
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        accountType: account.accountType,
        bank: account.bank,
        accountNumber: account.accountNumber,
        accountName: account.accountName,
        currency: account.currency,
        isMine: true
      });
    } else {
      setEditingAccount(null);
      setFormData({
        accountType: '',
        bank: '',
        accountNumber: '',
        accountName: '',
        currency: 'soles',
        isMine: false
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAccount(null);
    setFormData({
      accountType: '',
      bank: '',
      accountNumber: '',
      accountName: '',
      currency: 'soles',
      isMine: false
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAccount = async () => {
    if (!formData.accountType || !formData.bank || !formData.accountNumber || !formData.accountName || !formData.isMine) {
      return;
    }

    // Solo enviar los campos válidos para el backend
    const payload = {
      accountType: formData.accountType,
      bank: formData.bank,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      currency: formData.currency,
    };

    try {
      if (editingAccount) {
        await api.put(`/bank-accounts/${editingAccount.id}`, payload);
        setSnackbar({ open: true, message: 'Cuenta actualizada exitosamente', severity: 'success' });
      } else {
        await api.post('/bank-accounts', payload);
        setSnackbar({ open: true, message: 'Cuenta creada exitosamente', severity: 'success' });
        
        // Llamar callback si existe
        if (onAccountAdded) {
          try {
            onAccountAdded();
          } catch (callbackError) {
            console.error('Error en callback onAccountAdded:', callbackError);
          }
        }
      }
      
      // Cerrar modal primero
      handleCloseModal();
      
      // Recargar cuentas después de un pequeño delay para evitar problemas de renderizado
      setTimeout(() => {
        loadAccounts();
      }, 100);
      
    } catch (error) {
      console.error('Error al guardar la cuenta:', error);
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Error al guardar la cuenta', 
        severity: 'error' 
      });
    }
  };

  const handleDeleteAccount = async (accountId) => {
    try {
      await api.delete(`/bank-accounts/${accountId}`);
      setSnackbar({ open: true, message: 'Cuenta eliminada exitosamente', severity: 'success' });
      loadAccounts();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar la cuenta', severity: 'error' });
    }
  };

  const handleCopyAccountNumber = async (accountNumber) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setSnackbar({ open: true, message: 'Número de cuenta copiado', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al copiar el número', severity: 'error' });
    }
  };

  const getBankLogo = (bankName) => {
    const bank = banks.find(b => b.name === bankName);
    return bank?.logo || null;
  };

  const solesAccounts = accounts?.filter(account => account.currency === 'soles') || [];
  const dollarsAccounts = accounts?.filter(account => account.currency === 'dollars') || [];

  const hasAccounts = accounts && accounts.length > 0;

  // Si es modal, solo mostrar el formulario
  if (isModal) {
    return (
      <Box>
        {/* Banner informativo naranja */}
        <Alert 
          severity="warning" 
          icon={<InfoIcon />}
          sx={{ 
            mb: 3, 
            bgcolor: '#fff3cd', 
            color: '#856404',
            '& .MuiAlert-icon': { color: '#f39c12' }
          }}
        >
          La cuenta que agregues debe estar a <strong>tu nombre</strong> para que tu operación sea exitosa. 
          MangosCash no realiza transferencias a <strong>cuentas de terceros</strong>.
        </Alert>

        {/* Formulario */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo de cuenta</InputLabel>
            <Select
              value={formData.accountType}
              onChange={(e) => handleInputChange('accountType', e.target.value)}
              label="Tipo de cuenta"
            >
              {accountTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Banco</InputLabel>
            <Select
              value={formData.bank}
              onChange={(e) => handleInputChange('bank', e.target.value)}
              label="Banco"
            >
              {banks.map((bank) => (
                <MenuItem key={bank.name} value={bank.name}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Número de cuenta"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            fullWidth
            placeholder="Ej: 123-456789-0-12"
          />

          <TextField
            label="Alias de la cuenta"
            value={formData.accountName}
            onChange={(e) => handleInputChange('accountName', e.target.value)}
            fullWidth
            placeholder="Ej: Mi cuenta principal"
          />

          <FormControl fullWidth>
            <InputLabel>Moneda</InputLabel>
            <Select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              label="Moneda"
            >
              <MenuItem value="soles">Soles (PEN)</MenuItem>
              <MenuItem value="dollars">Dólares (USD)</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isMine}
                onChange={(e) => handleInputChange('isMine', e.target.checked)}
                sx={{
                  color: '#57C9A6',
                  '&.Mui-checked': {
                    color: '#57C9A6',
                  },
                }}
              />
            }
            label="Confirmo que esta cuenta está a mi nombre"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                color: '#333'
              }
            }}
          />
        </Box>

        {/* Botón de guardar */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSaveAccount}
            disabled={!formData.accountType || !formData.bank || !formData.accountNumber || !formData.accountName || !formData.isMine}
            sx={{
              bgcolor: '#57C9A6',
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                bgcolor: '#3bbd8c',
              },
              '&:disabled': {
                bgcolor: '#ccc',
                color: '#666'
              }
            }}
          >
            {editingAccount ? 'ACTUALIZAR CUENTA' : 'GUARDAR CUENTA'}
          </Button>
        </Box>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Fade in={showContent} timeout={800}>
          <Box>
            {hasAccounts ? (
              // Estado con cuentas
              <Grow in={showContent} timeout={1000}>
                <Box>
                  {/* Cuentas en Soles */}
                  <Paper sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Accordion defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                            gap: 2
                          }
                        }}
                      >
                        <img src={peruFlag} alt="Perú" style={{ width: 24, height: 16 }} />
                        <Typography sx={{ 
                          fontFamily: 'Roboto, sans-serif', 
                          fontSize: 16, 
                          fontWeight: 600,
                          color: '#333'
                        }}>
                          Cuentas en soles S/.
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {solesAccounts.length > 0 ? (
                          <Box>
                            {solesAccounts.map((account) => (
                              <Box key={account.id} sx={{ 
                                p: 3, 
                                mb: 2, 
                                bgcolor: 'white', 
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                              }}>
                                {/* Logo del banco */}
                                {getBankLogo(account.bank) && (
                                  <img 
                                    src={getBankLogo(account.bank)} 
                                    alt={account.bank} 
                                    style={{ width: 60, height: 'auto' }} 
                                  />
                                )}
                                
                                {/* Información de la cuenta */}
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Número de cta.
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountNumber}
                                    </Typography>
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleCopyAccountNumber(account.accountNumber)}
                                      sx={{ color: '#1976d2' }}
                                    >
                                      <CopyIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Alias
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountName}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Tipo de cta.
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountType}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                {/* Botones de acción */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleOpenModal(account)}
                                    sx={{ color: '#666' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    sx={{ color: '#f44336' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
                              No tienes cuentas en soles registradas
                            </Typography>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Paper>

                  {/* Cuentas en Dólares */}
                  <Paper sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                    <Accordion defaultExpanded>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                            gap: 2
                          }
                        }}
                      >
                        <img src={usaFlag} alt="USA" style={{ width: 24, height: 16 }} />
                        <Typography sx={{ 
                          fontFamily: 'Roboto, sans-serif', 
                          fontSize: 16, 
                          fontWeight: 600,
                          color: '#333'
                        }}>
                          Cuentas en dólares $
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {dollarsAccounts.length > 0 ? (
                          <Box>
                            {dollarsAccounts.map((account) => (
                              <Box key={account.id} sx={{ 
                                p: 3, 
                                mb: 2, 
                                bgcolor: 'white', 
                                borderRadius: 2,
                                border: '1px solid #e0e0e0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3
                              }}>
                                {/* Logo del banco */}
                                {getBankLogo(account.bank) && (
                                  <img 
                                    src={getBankLogo(account.bank)} 
                                    alt={account.bank} 
                                    style={{ width: 60, height: 'auto' }} 
                                  />
                                )}
                                
                                {/* Información de la cuenta */}
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Número de cta.
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountNumber}
                                    </Typography>
                                    <IconButton 
                                      size="small"
                                      onClick={() => handleCopyAccountNumber(account.accountNumber)}
                                      sx={{ color: '#1976d2' }}
                                    >
                                      <CopyIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Alias
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountName}
                                    </Typography>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 12, 
                                      color: '#666',
                                      fontWeight: 500
                                    }}>
                                      Tipo de cta.
                                    </Typography>
                                    <Typography sx={{ 
                                      fontFamily: 'Roboto, sans-serif', 
                                      fontSize: 14, 
                                      fontWeight: 600,
                                      color: '#333'
                                    }}>
                                      {account.accountType}
                                    </Typography>
                                  </Box>
                                </Box>
                                
                                {/* Botones de acción */}
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleOpenModal(account)}
                                    sx={{ color: '#666' }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    sx={{ color: '#f44336' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 3 }}>
                            <Typography sx={{ color: '#666', fontFamily: 'Roboto, sans-serif' }}>
                              No tienes cuentas en dólares registradas
                            </Typography>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                  
                  {/* Botón para agregar cuenta después de las cuentas existentes */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal()}
                      sx={{
                        bgcolor: '#57C9A6',
                        color: 'white',
                        borderRadius: 999,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        '&:hover': {
                          bgcolor: '#3bbd8c',
                          boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                        },
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: 16
                      }}
                    >
                      Agregar cuenta
                    </Button>
                  </Box>
                </Box>
              </Grow>
            ) : (
              // Estado sin cuentas
              <Grow in={showContent} timeout={1000}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <LottieAnimation />
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                      color: '#333',
                      mb: 2
                    }}
                  >
                    No tienes cuentas bancarias
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#666',
                      fontFamily: 'Roboto, sans-serif',
                      mb: 4,
                      maxWidth: 500,
                      mx: 'auto'
                    }}
                  >
                    Agrega tu primera cuenta bancaria para poder realizar operaciones de cambio de divisas de forma rápida y segura.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{
                      bgcolor: '#57C9A6',
                      color: 'white',
                      borderRadius: 999,
                      px: 3,
                      py: 1.5,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      '&:hover': {
                        bgcolor: '#3bbd8c',
                        boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
                      },
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: 16,
                      mt: 2
                    }}
                  >
                    Agregar cuenta
                  </Button>
                </Box>
              </Grow>
            )}
          </Box>
        </Fade>
      </Box>

      {/* Modal para agregar/editar cuenta */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            animation: 'slideInRight 0.3s ease-out'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 24, 
            fontWeight: 700,
            color: '#333'
          }}>
            {editingAccount ? 'Editar cuenta' : 'Agregar cuenta'}
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Banner informativo naranja */}
          <Alert 
            severity="warning" 
            icon={<InfoIcon />}
            sx={{ 
              mb: 3, 
              bgcolor: '#fff3cd', 
              color: '#856404',
              '& .MuiAlert-icon': { color: '#f39c12' }
            }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {}}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            La cuenta que agregues debe estar a <strong>tu nombre</strong> para que tu operación sea exitosa. 
            MangosCash no realiza transferencias a <strong>cuentas de terceros</strong>.
          </Alert>

          {/* Formulario */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de cuenta</InputLabel>
              <Select
                value={formData.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                label="Tipo de cuenta"
              >
                {accountTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Banco</InputLabel>
              <Select
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
                label="Banco"
              >
                {banks.map((bank) => (
                  <MenuItem key={bank.name} value={bank.name}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Número de cuenta"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              fullWidth
              placeholder="Ej: 123-456789-0-12"
            />

            <TextField
              label="Alias de la cuenta"
              value={formData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
              fullWidth
              placeholder="Ej: Mi cuenta principal"
            />

            <FormControl fullWidth>
              <InputLabel>Moneda</InputLabel>
              <Select
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                label="Moneda"
              >
                <MenuItem value="soles">Soles (PEN)</MenuItem>
                <MenuItem value="dollars">Dólares (USD)</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isMine}
                  onChange={(e) => handleInputChange('isMine', e.target.checked)}
                  sx={{
                    color: '#57C9A6',
                    '&.Mui-checked': {
                      color: '#57C9A6',
                    },
                  }}
                />
              }
              label="Confirmo que esta cuenta está a mi nombre"
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 14,
                  color: '#333'
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            variant="contained"
            onClick={handleSaveAccount}
            disabled={!formData.accountType || !formData.bank || !formData.accountNumber || !formData.accountName || !formData.isMine}
            sx={{
              bgcolor: '#57C9A6',
              color: 'white',
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                bgcolor: '#3bbd8c',
              },
              '&:disabled': {
                bgcolor: '#ccc',
                color: '#666'
              }
            }}
          >
            {editingAccount ? 'ACTUALIZAR CUENTA' : 'GUARDAR CUENTA'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BankAccounts; 