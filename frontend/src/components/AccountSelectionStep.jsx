import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import BankAccounts from './BankAccounts';
import api from '../services/api';

const AccountSelectionStep = ({ accounts, operationData, onAccountSelection, error }) => {
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [localAccounts, setLocalAccounts] = useState(accounts);

  // Actualizar cuentas locales cuando cambien las props
  useEffect(() => {
    setLocalAccounts(accounts);
  }, [accounts]);

  // Filtrar cuentas según la moneda
  const fromCurrency = operationData.fromCurrency;
  const toCurrency = operationData.toCurrency;

  // Corregir el filtrado para que funcione con 'soles' y 'dollars'
  const fromAccounts = localAccounts.filter(account => {
    if (fromCurrency === 'PEN') {
      return account.currency === 'soles';
    } else if (fromCurrency === 'USD') {
      return account.currency === 'dollars';
    }
    return false;
  });

  const toAccounts = localAccounts.filter(account => {
    if (toCurrency === 'PEN') {
      return account.currency === 'soles';
    } else if (toCurrency === 'USD') {
      return account.currency === 'dollars';
    }
    return false;
  });

  // Debug logs
  console.log('AccountSelectionStep Debug:', {
    fromCurrency,
    toCurrency,
    allAccounts: localAccounts,
    fromAccounts,
    toAccounts,
    fromAccountsCount: fromAccounts.length,
    toAccountsCount: toAccounts.length
  });

  const handleFromAccountChange = (event) => {
    const selectedAccount = fromAccounts.find(acc => acc.id === event.target.value);
    setFromAccount(event.target.value);
    onAccountSelection(selectedAccount, toAccounts.find(acc => acc.id === toAccount));
  };

  const handleToAccountChange = (event) => {
    const selectedAccount = toAccounts.find(acc => acc.id === event.target.value);
    setToAccount(event.target.value);
    onAccountSelection(fromAccounts.find(acc => acc.id === fromAccount), selectedAccount);
  };

  const handleAddAccount = () => {
    setShowAddAccountModal(true);
  };

  const handleCloseModal = () => {
    setShowAddAccountModal(false);
  };

  // Función para recargar cuentas después de agregar una nueva
  const handleAccountAdded = async () => {
    try {
      const response = await api.get('/bank-accounts');
      setLocalAccounts(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error recargando cuentas:', error);
    }
  };

  const getCurrencyLabel = (currency) => {
    return currency === 'PEN' ? 'Soles' : 'Dólares';
  };

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          color: '#333',
          mb: 2
        }}
      >
        Selecciona tu cuenta
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#666',
          fontFamily: 'Roboto, sans-serif',
          mb: 3
        }}
      >
        Selecciona el banco de donde nos envías y la cuenta donde deseas recibir.
      </Typography>

      {/* Alerta informativa */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ 
          mb: 3,
          bgcolor: '#e3f2fd',
          color: '#1976d2',
          '& .MuiAlert-icon': { color: '#1976d2' }
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
        Recuerda que debes ser el titular de la cuenta que envía. Las cuentas de terceros solo sirven para recibir.
      </Alert>

      {/* Campos de selección */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>¿Desde que cuenta nos envías? ({getCurrencyLabel(fromCurrency)})</InputLabel>
          <Select
            value={fromAccount}
            onChange={handleFromAccountChange}
            label={`¿Desde que cuenta nos envías? (${getCurrencyLabel(fromCurrency)})`}
          >
            {fromAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.bank} - {account.accountType} - {account.accountNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>¿En que cuenta recibirás tu cambio? ({getCurrencyLabel(toCurrency)})</InputLabel>
          <Select
            value={toAccount}
            onChange={handleToAccountChange}
            label={`¿En que cuenta recibirás tu cambio? (${getCurrencyLabel(toCurrency)})`}
          >
            {toAccounts.map((account) => (
              <MenuItem key={account.id} value={account.id}>
                {account.bank} - {account.accountType} - {account.accountNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Botón para agregar cuenta */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddAccount}
        sx={{ 
          borderColor: '#057c39',
          color: '#057c39',
          '&:hover': {
            borderColor: '#046a30',
            bgcolor: 'rgba(5, 124, 57, 0.04)'
          }
        }}
      >
        Agregar nueva cuenta +
      </Button>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Modal para agregar cuenta */}
      <Dialog
        open={showAddAccountModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
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
            Agregar cuenta bancaria
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <BankAccounts 
            isModal={true}
            onAccountAdded={handleAccountAdded}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AccountSelectionStep; 