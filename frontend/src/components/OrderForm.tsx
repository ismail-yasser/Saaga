import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Stack,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AttachMoney } from '@mui/icons-material';
import { Order } from '../types';

interface OrderFormProps {
  onCreateOrder: (amount: number) => Promise<Order | null>;
  loading: boolean;
  error: string | null;
}

const OrderForm: React.FC<OrderFormProps> = ({ onCreateOrder, loading, error }) => {
  const [amount, setAmount] = useState<string>('');
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setSuccess(null);
    const result = await onCreateOrder(numAmount);
    
    if (result) {
      setSuccess(`Order created successfully! Order ID: ${result.orderId}`);
      setAmount('');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Order Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          required
          inputProps={{ min: 0.01, step: 0.01 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
          disabled={loading}
        />
        
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading || !amount || parseFloat(amount) <= 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creating Order...' : 'Create Order'}
        </Button>

        {error && (
          <Alert severity="error" onClose={() => {}}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default OrderForm;
