import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Add,
  CheckCircle,
  Error,
  Warning,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Simple service health check
const checkServiceHealth = async (name: string, port: number) => {
  try {
    const response = await fetch(`http://localhost:${port}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return {
      name,
      status: response.ok ? 'HEALTHY' : 'UNHEALTHY',
      port,
    };
  } catch (error) {
    return {
      name,
      status: 'UNHEALTHY',
      port,
    };
  }
};

// Simple order creation
const createOrder = async (amount: number) => {
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      return { success: false, error: 'Failed to create order' };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Simple orders fetch
const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/orders');
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
};

function App() {
  const sagaState = useSagaState();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Saga Microservices Dashboard
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary">
            Real-time visualization of distributed transaction orchestration
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Service Status */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Service Health Status
              </Typography>
              <ServiceStatus serviceStatuses={sagaState.serviceStatuses} />
            </Paper>
          </Grid>

          {/* Order Creation Form */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Create New Order
              </Typography>
              <OrderForm 
                onCreateOrder={sagaState.createOrder} 
                loading={sagaState.loading}
                error={sagaState.error}
              />
            </Paper>
          </Grid>

          {/* Saga Workflow Visualization */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Saga Workflow
              </Typography>
              <SagaWorkflow 
                transactions={sagaState.transactions}
                serviceStatuses={sagaState.serviceStatuses}
              />
            </Paper>
          </Grid>

          {/* Transaction History */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <TransactionHistory 
                orders={sagaState.orders}
                transactions={sagaState.transactions}
              />
            </Paper>
          </Grid>

          {/* Real-time Events */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Real-time Events
              </Typography>
              <SagaEvents events={sagaState.sagaEvents} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
