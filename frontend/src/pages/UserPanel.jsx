import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { 
  Home as HomeIcon,
  History as HistoryIcon,
  AccountBalance as BankIcon,
  Notifications as AlertIcon,
  AccountBalanceWallet as WalletIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  SwapHoriz as SwapIcon,
  Star as StarIcon,
  Info as InfoIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LOGOMANGOCASHPARADO from '../assets/LOGOMANGOCASHPARADO.svg';
import bcpLogo from '../assets/bcp.svg';
import interbankLogo from '../assets/interbank.svg';
import bbvaLogo from '../assets/bbva.svg';
import scotiabankLogo from '../assets/scotiabank.svg';
import pichinchaLogo from '../assets/pichincha.svg';
import Calculator from '../components/Calculator';
import OperationsHistory from '../components/OperationsHistory';
import BankAccounts from '../components/BankAccounts';
import { AlertForm } from '../components/AlertBlock';
import DolarHoyChart from '../components/DolarHoyChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserProfilePage from './UserProfilePage';
import DashboardAlerts from '../components/DashboardAlerts';

const drawerWidth = 280;

const UserPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [couponCode, setCouponCode] = useState('');
  const [manguitos, setManguitos] = useState(2000);
  const [swap, setSwap] = useState(false);
  const [swapActive, setSwapActive] = useState(false);
  const [penAmount, setPenAmount] = useState('');

  // Lógica de estado y funciones:
  const [alerts, setAlerts] = useState([]);
  const [editingAlert, setEditingAlert] = useState(null);
  const loadAlerts = async () => {
    const res = await api.get('/alerts');
    setAlerts(res.data);
  };
  const handleEdit = (alert) => setEditingAlert(alert);
  const closeEditModal = () => setEditingAlert(null);
  const handleDelete = async (id) => {
    await api.delete(`/alerts/${id}`);
    loadAlerts();
  };
  useEffect(() => { if (selectedMenu === 'alertas') loadAlerts(); }, [selectedMenu]);

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

  const handleSwap = () => {
    setSwap(!swap);
    setSwapActive(true);
    setTimeout(() => setSwapActive(false), 400);
  };

  const handlePenChange = (amount) => {
    setPenAmount(amount);
  };

  const menuItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <HomeIcon /> },
    { id: 'historial', text: 'Historial de operaciones', icon: <HistoryIcon /> },
    { id: 'cuentas', text: 'Cuentas Bancarias', icon: <BankIcon /> },
    { id: 'alertas', text: 'Alertas', icon: <AlertIcon /> },
    { id: 'manguitos', text: 'Mis Manguitos', icon: <WalletIcon /> },
    { id: 'ayuda', text: 'Ayuda', icon: <HelpIcon /> },
  ];

  // Renderizar contenido según el menú seleccionado
  const renderContent = () => {
    switch (selectedMenu) {
      case 'historial':
        return <OperationsHistory />;
      case 'cuentas':
        return <BankAccounts />;
      case 'alertas':
        return <DashboardAlerts />;
      case 'perfil':
        return <UserProfilePage />;
      case 'dashboard':
      default:
        return (
          <Box sx={{ flexGrow: 1, display: 'flex', bgcolor: '#f8f9fa' }}>
            {/* Left Content - Calculator */}
            <Box sx={{ flex: 1, p: 4 }}>
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  fontSize: 28, 
                  fontWeight: 700, 
                  mb: 4,
                  color: '#333'
                }}>
                  Cambio de Divisas
                </Typography>
                
                {/* Calculator Component */}
                <Calculator 
                  swap={swap}
                  onSwap={handleSwap}
                  swapActive={swapActive}
                  onPenChange={handlePenChange}
                />
                
                {/* Coupon Section */}
                <Box sx={{ mt: 4, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 16, 
                    fontWeight: 600, 
                    mb: 2,
                    color: '#333'
                  }}>
                    Cupón de Descuento
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      placeholder="Ingresa el cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          bgcolor: 'white',
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: '#057c39',
                        color: 'white',
                        fontWeight: 700,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: '#046a30',
                        }
                      }}
                    >
                      APLICAR
                    </Button>
                  </Box>
                </Box>

                {/* Start Operation Button */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#57C9A6',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 18,
                      px: 6,
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(87, 201, 166, 0.3)',
                      '&:hover': {
                        bgcolor: '#3bbd8c',
                        boxShadow: '0 6px 16px rgba(87, 201, 166, 0.4)',
                      }
                    }}
                  >
                    INICIAR OPERACIÓN
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Right Panel - Bank Information */}
            <Box sx={{ width: 320, p: 4 }}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  fontSize: 18, 
                  fontWeight: 700, 
                  mb: 3,
                  color: '#333'
                }}>
                  Transferencias Disponibles
                </Typography>

                {/* Immediate Transfers */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: '#057c39', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
                        15 MIN
                      </Typography>
                    </Box>
                    <Typography sx={{ 
                      fontFamily: 'Roboto, sans-serif', 
                      fontSize: 14, 
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Transferencias inmediatas en 15 minutos
                    </Typography>
                  </Box>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#666',
                    mb: 1
                  }}>
                    Todo el Perú
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <img src={bcpLogo} alt="BCP" style={{ height: 24, width: 'auto' }} />
                    <img src={interbankLogo} alt="Interbank" style={{ height: 24, width: 'auto' }} />
                  </Box>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#666',
                    mb: 1
                  }}>
                    Lima
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <img src={pichinchaLogo} alt="BanBif" style={{ height: 24, width: 'auto' }} />
                  </Box>
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 10, 
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    Lunes a Viernes
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Interbank Transfers */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      bgcolor: '#666', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 700 }}>
                        24 HRS
                      </Typography>
                    </Box>
                    <Typography sx={{ 
                      fontFamily: 'Roboto, sans-serif', 
                      fontSize: 14, 
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      Transferencias interbancarias en 1 día hábil
                    </Typography>
                  </Box>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#666',
                    mb: 1
                  }}>
                    Lima
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <img src={bbvaLogo} alt="BBVA" style={{ height: 24, width: 'auto' }} />
                    <img src={scotiabankLogo} alt="Scotiabank" style={{ height: 24, width: 'auto' }} />
                    <img src={pichinchaLogo} alt="Banco Pichincha" style={{ height: 24, width: 'auto' }} />
                  </Box>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#666',
                    mb: 1
                  }}>
                    y otros bancos
                  </Typography>
                  
                  <Typography sx={{ 
                    fontFamily: 'Roboto, sans-serif', 
                    fontSize: 12, 
                    color: '#666',
                    fontWeight: 600
                  }}>
                    Montos desde S/300 o $100
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography sx={{ 
                  fontFamily: 'Roboto, sans-serif', 
                  fontSize: 10, 
                  color: '#999',
                  fontStyle: 'italic',
                  textAlign: 'center'
                }}>
                  (*) Válido durante días hábiles dentro del horario de atención
                </Typography>
              </Paper>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'white',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
          <img 
            src={LOGOMANGOCASHPARADO} 
            alt="MangosCash" 
            style={{ width: 180, height: 'auto' }}
          />
        </Box>
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.id}
              button
              onClick={() => setSelectedMenu(item.id)}
              sx={{
                bgcolor: selectedMenu === item.id ? '#f5f5f5' : 'transparent',
                '&:hover': {
                  bgcolor: selectedMenu === item.id ? '#f0f0f0' : '#fafafa',
                },
                py: 1.5,
                px: 3,
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedMenu === item.id ? '#057c39' : '#666',
                minWidth: 40 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiTypography-root': {
                    fontSize: 14,
                    fontWeight: selectedMenu === item.id ? 600 : 400,
                    color: selectedMenu === item.id ? '#057c39' : '#333',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header - Solo mostrar si no estamos en historial */}
        {selectedMenu !== 'historial' && (
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
                  {selectedMenu === 'cuentas' ? 'Mis cuentas' : 'Dashboard'}
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
        )}

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

        {/* Content Area */}
        {renderContent()}
      </Box>

      {/* Floating WhatsApp Button */}
      <Box sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000
      }}>
        <IconButton
          sx={{
            bgcolor: '#25D366',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            '&:hover': {
              bgcolor: '#128C7E',
              boxShadow: '0 6px 16px rgba(37, 211, 102, 0.6)',
            }
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UserPanel; 
