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
  Grow
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import peruFlag from '../assets/peru.svg';
import usaFlag from '../assets/USA.svg';

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
    <dotlottie-wc 
      src="https://lottie.host/1e9d037e-db07-49bb-8c2f-5a63471ba3e4/60uVUsTO18.lottie" 
      style={{ width: '200px', height: '200px' }} 
      speed="1" 
      autoplay 
      loop
    />
  );
};

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [formData, setFormData] = useState({
    accountType: '',
    bank: '',
    accountNumber: '',
    accountName: '',
    currency: 'soles',
    isMine: false
  });

  const banks = [
    'BCP',
    'BBVA',
    'Interbank',
    'Scotiabank',
    'Banco Pichincha',
    'BanBif',
    'Mi Banco',
    'Banco Azteca',
    'Banco Ripley',
    'Banco Falabella'
  ];

  const accountTypes = [
    'Cuenta Corriente',
    'Cuenta de Ahorros',
    'Cuenta Sueldo',
    'Cuenta Digital'
  ];

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  const handleSaveAccount = () => {
    if (!formData.accountType || !formData.bank || !formData.accountNumber || !formData.accountName || !formData.isMine) {
      return;
    }

    const newAccount = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAccount]);
    handleCloseModal();
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
                                p: 2, 
                                mb: 2, 
                                bgcolor: '#f8f9fa', 
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                              }}>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 14, 
                                  fontWeight: 600,
                                  color: '#333',
                                  mb: 1
                                }}>
                                  {account.accountName}
                                </Typography>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 12, 
                                  color: '#666'
                                }}>
                                  {account.bank} - {account.accountType}
                                </Typography>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 12, 
                                  color: '#666'
                                }}>
                                  ****{account.accountNumber.slice(-4)}
                                </Typography>
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
                                p: 2, 
                                mb: 2, 
                                bgcolor: '#f8f9fa', 
                                borderRadius: 2,
                                border: '1px solid #e0e0e0'
                              }}>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 14, 
                                  fontWeight: 600,
                                  color: '#333',
                                  mb: 1
                                }}>
                                  {account.accountName}
                                </Typography>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 12, 
                                  color: '#666'
                                }}>
                                  {account.bank} - {account.accountType}
                                </Typography>
                                <Typography sx={{ 
                                  fontFamily: 'Roboto, sans-serif', 
                                  fontSize: 12, 
                                  color: '#666'
                                }}>
                                  ****{account.accountNumber.slice(-4)}
                                </Typography>
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
                      onClick={handleOpenModal}
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
                    onClick={handleOpenModal}
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

      {/* Modal para agregar cuenta */}
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
            Agregar cuenta
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
                  <MenuItem key={bank} value={bank}>{bank}</MenuItem>
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
            GUARDAR CUENTA
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BankAccounts; 