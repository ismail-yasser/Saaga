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
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

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
