import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Fade,
  Grow,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  ListItemText
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
      src="https://lottie.host/9297a740-4b88-4100-8c92-4cf54ef77646/0tB5xTffDu.lottie" 
      style={{ width: '120px', height: '120px' }} 
      speed="1" 
      autoplay 
      loop
    />
  );
};

// Componente para el número animado
const AnimatedNumber = ({ value, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Función de easing para una animación suave
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <Typography
      sx={{
        fontFamily: 'Roboto, sans-serif',
        fontSize: 32,
        fontWeight: 700,
        color: '#057c39',
        textAlign: 'center'
      }}
    >
      S/ {displayValue.toFixed(2)}
    </Typography>
  );
};

const OperationsHistory = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(1);
  const [savings, setSavings] = useState(23.22);
  const [showContent, setShowContent] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [manguitos, setManguitos] = useState(2000);

  // Datos de ejemplo para las transacciones
  const transactions = [
    {
      id: 'kmb7ce58d',
      sent: '$ 20.00',
      received: 'S/ 78.64',
      rate: '3.932',
      mangazos: '-',
      date: '28/09/2022',
      status: 'completed'
    },
    {
      id: 'kmb8f92a1',
      sent: '$ 50.00',
      received: 'S/ 196.60',
      rate: '3.932',
      mangazos: '-',
      date: '27/09/2022',
      status: 'completed'
    },
    {
      id: 'kmb9c34e2',
      sent: '$ 100.00',
      received: 'S/ 393.20',
      rate: '3.932',
      mangazos: '-',
      date: '26/09/2022',
      status: 'completed'
    },
    {
      id: 'kmb0d45f3',
      sent: '$ 25.00',
      received: 'S/ 98.30',
      rate: '3.932',
      mangazos: '-',
      date: '25/09/2022',
      status: 'in_process'
    },
    {
      id: 'kmb1e56g4',
      sent: '$ 75.00',
      received: 'S/ 294.90',
      rate: '3.932',
      mangazos: '-',
      date: '24/09/2022',
      status: 'cancelled'
    }
  ];

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in_process':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'in_process':
        return 'En proceso';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid #e0e0e0',
          color: '#333'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: 20, 
              color: '#333',
              fontWeight: 700
            }}>
              Historial de operaciones
            </Typography>
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: 14, 
              color: '#666',
              fontWeight: 500
            }}>
              Horario: Lunes a viernes 9:00 am a 7:00 p.m Sábados de 09:00 am a 2:00 pm
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<StarIcon sx={{ color: '#FFD700' }} />}
              label={`Tienes ${manguitos} Manguitos`}
              sx={{ 
                bgcolor: '#fff3cd', 
                color: '#856404',
                fontWeight: 600,
                '& .MuiChip-icon': { color: '#FFD700' }
              }}
            />
            
            <IconButton onClick={handleMenuClick}>
              <Avatar sx={{ bgcolor: '#057c39', width: 32, height: 32 }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            
            <Typography sx={{ 
              fontFamily: 'Roboto, sans-serif', 
              fontSize: 14, 
              fontWeight: 600,
              color: '#333'
            }}>
              {user?.name || 'Usuario'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>

      {/* Contenido principal */}
      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Fade in={showContent} timeout={800}>
          <Box>
            {/* Sección de ahorro acumulado */}
            <Grow in={showContent} timeout={1000}>
              <Paper sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center',
                bgcolor: 'white'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <LottieAnimation />
                </Box>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#333',
                  mb: 2
                }}>
                  Ahorro acumulado
                </Typography>
                <AnimatedNumber value={savings} />
              </Paper>
            </Grow>

            {/* Tabs */}
            <Grow in={showContent} timeout={1200}>
              <Paper sx={{ 
                mb: 3, 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                bgcolor: 'white'
              }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      fontFamily: 'Roboto, sans-serif',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: 16,
                      py: 2,
                      px: 4,
                    },
                    '& .Mui-selected': {
                      color: '#057c39',
                    },
                    '& .MuiTabs-indicator': {
                      bgcolor: '#057c39',
                      height: 3,
                    }
                  }}
                >
                  <Tab label="En proceso" />
                  <Tab label="Finalizadas" />
                </Tabs>
              </Paper>
            </Grow>

            {/* Tabla de transacciones */}
            <Grow in={showContent} timeout={1400}>
              <Paper sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                bgcolor: 'white',
                overflow: 'hidden'
              }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          N° de operación
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Enviado
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Recibe
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Tipo de cambio
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Mangazos
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Fecha
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Estado
                        </TableCell>
                        <TableCell sx={{ 
                          fontFamily: 'Roboto, sans-serif',
                          fontWeight: 700,
                          color: '#333',
                          fontSize: 14
                        }}>
                          Acción
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <Grow 
                          key={transaction.id} 
                          in={showContent} 
                          timeout={1600 + (index * 100)}
                        >
                          <TableRow sx={{ 
                            '&:hover': { 
                              bgcolor: '#f8f9fa' 
                            },
                            borderBottom: '1px solid #e0e0e0'
                          }}>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#333',
                              fontWeight: 500
                            }}>
                              {transaction.id}
                            </TableCell>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#333',
                              fontWeight: 600
                            }}>
                              {transaction.sent}
                            </TableCell>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#333',
                              fontWeight: 600
                            }}>
                              {transaction.received}
                            </TableCell>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#333'
                            }}>
                              {transaction.rate}
                            </TableCell>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#666'
                            }}>
                              {transaction.mangazos}
                            </TableCell>
                            <TableCell sx={{ 
                              fontFamily: 'Roboto, sans-serif',
                              fontSize: 14,
                              color: '#666'
                            }}>
                              {transaction.date}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getStatusText(transaction.status)}
                                size="small"
                                sx={{
                                  bgcolor: getStatusColor(transaction.status),
                                  color: 'white',
                                  fontFamily: 'Roboto, sans-serif',
                                  fontWeight: 600,
                                  fontSize: 12
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small"
                                sx={{ 
                                  color: '#057c39',
                                  '&:hover': {
                                    bgcolor: 'rgba(5, 124, 57, 0.1)'
                                  }
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </Grow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grow>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};
