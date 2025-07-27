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
  Grow
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
      style={{ width: '300px', height: '300px' }} 
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
  const [tabValue, setTabValue] = useState(1);
  const [savings, setSavings] = useState(23.22);
  const [showContent, setShowContent] = useState(false);

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
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        px: 4,
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/dashboard')}
            sx={{ color: '#666' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ 
            fontFamily: 'Roboto, sans-serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#333'
          }}>
            Historial de operaciones
          </Typography>
        </Box>
      </Box>

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

export default OperationsHistory; 