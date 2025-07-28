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

// Componente para el Lottie
const LottieAnimation = () => {
  useEffect(() => {
    // Cargar el script de dotlottie
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <Global styles={`
        dotlottie-wc canvas {
          width: 100% !important;
          height: 100% !important;
          aspect-ratio: 1 / 1 !important;
          object-fit: contain !important;
          image-rendering: auto !important;
          max-width: 100% !important;
          max-height: 100% !important;
        }
      `} />
      <Box sx={{ width: 240, height: 240, minWidth: 240, minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
        <dotlottie-wc 
          src="https://lottie.host/1e9d037e-db07-49bb-8c2f-5a63471ba3e4/60uVUsTO18.lottie" 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          speed="1" 
          autoplay 
          loop
        />
      </Box>
    </>
  );
};

const BankAccounts = () => {
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
    setTimeout(() => setShowContent(true), 300);
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const response = await api.get('/bank-accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error cargando cuentas:', error);
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
      }
      handleCloseModal();
      loadAccounts();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al guardar la cuenta', severity: 'error' });
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

  const solesAccounts = accounts.filter(account => account.currency === 'soles');
  const dollarAccounts = accounts.filter(account => account.currency === 'dollars');

  const hasAccounts = accounts.length > 0;

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e0e0e0', px: 4, py: 2 }}>
        <Typography sx={{ 
          fontFamily: 'Roboto, sans-serif', 
          fontSize: 24, 
          fontWeight: 700, 
          color: '#333' 
        }}>
          Mis Cuentas
        </Typography>
      </Box>

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
                                    sx={{ color: '#d32f2f' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography sx={{ 
                            fontFamily: 'Roboto, sans-serif', 
                            fontSize: 14, 
                            color: '#666',
                            fontStyle: 'italic'
                          }}>
                            No tienes cuentas en soles registradas
                          </Typography>
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
                        {dollarAccounts.length > 0 ? (
                          <Box>
                            {dollarAccounts.map((account) => (
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
                                    sx={{ color: '#d32f2f' }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography sx={{ 
                            fontFamily: 'Roboto, sans-serif', 
                            fontSize: 14, 
                            color: '#666',
                            fontStyle: 'italic'
                          }}>
                            No tienes cuentas en dólares registradas
                          </Typography>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Paper>

                  {/* Botón Agregar Cuenta */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenModal()}
                      sx={{
                        bgcolor: '#057c39',
                        color: 'white',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: 16,
                        '&:hover': {
                          bgcolor: '#046a30',
                        }
                      }}
                    >
                      Agregar cuenta
                    </Button>
                  </Box>

                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#999',
                    textAlign: 'center',
                    mt: 2
                  }}>
                    Puedes tener hasta 20 cuentas agregadas.
                  </Typography>
                </Box>
              </Grow>
            ) : (
              // Estado vacío
              <Grow in={showContent} timeout={1000}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '60vh',
                  textAlign: 'center'
                }}>
                  <Box sx={{ mb: 4 }}>
                    <LottieAnimation />
                  </Box>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 18, 
                    fontWeight: 600,
                    color: '#333',
                    mb: 1
                  }}>
                    Aún no has agregado ninguna cuenta
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 16, 
                    color: '#666',
                    mb: 4
                  }}>
                    para realizar tus cambios.
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenModal()}
                    sx={{
                      bgcolor: '#057c39',
                      color: 'white',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: 16,
                      '&:hover': {
                        bgcolor: '#046a30',
                      }
                    }}
                  >
                    + Agregar cuenta personal
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
          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
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
                  <MenuItem key={bank.name} value={bank.name}>{bank.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <TextField
              fullWidth
              label="Número de cuenta"
              placeholder="Escribe tu cuenta destino"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
            />

            <TextField
              fullWidth
              label="Ponle nombre a tu cuenta"
              placeholder="Escribe un alias"
              value={formData.accountName}
              onChange={(e) => handleInputChange('accountName', e.target.value)}
            />
          </Box>

          {/* Banner informativo azul */}
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            sx={{ 
              mb: 3, 
              bgcolor: '#e3f2fd', 
              color: '#0d47a1',
              '& .MuiAlert-icon': { color: '#1976d2' }
            }}
          >
            Operamos en Lima con todos los bancos. Y en provincia con el BCP y cuentas digitales Interbank.
          </Alert>

          {/* Selección de moneda */}
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif', 
            fontSize: 16, 
            fontWeight: 600,
            color: '#333',
            mb: 2
          }}>
            Moneda
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant={formData.currency === 'soles' ? 'contained' : 'outlined'}
              onClick={() => handleInputChange('currency', 'soles')}
              sx={{
                flex: 1,
                py: 1.5,
                bgcolor: formData.currency === 'soles' ? '#333' : 'transparent',
                color: formData.currency === 'soles' ? 'white' : '#333',
                borderColor: '#333',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: formData.currency === 'soles' ? '#222' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              SOLES
            </Button>
            <Button
              variant={formData.currency === 'dollars' ? 'contained' : 'outlined'}
              onClick={() => handleInputChange('currency', 'dollars')}
              sx={{
                flex: 1,
                py: 1.5,
                bgcolor: formData.currency === 'dollars' ? '#333' : 'transparent',
                color: formData.currency === 'dollars' ? 'white' : '#333',
                borderColor: '#333',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: formData.currency === 'dollars' ? '#222' : 'rgba(0,0,0,0.04)',
                }
              }}
            >
              DÓLARES
            </Button>
          </Box>

          {/* Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isMine}
                onChange={(e) => handleInputChange('isMine', e.target.checked)}
                sx={{
                  color: '#057c39',
                  '&.Mui-checked': {
                    color: '#057c39',
                  },
                }}
              />
            }
            label="Declaro que esta cuenta es mía"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontFamily: 'Roboto, sans-serif',
                fontSize: 14,
                color: '#333'
              }
            }}
          />
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