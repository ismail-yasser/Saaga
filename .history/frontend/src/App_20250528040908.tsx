import React, { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  Card,
  CardContent,
  Chip,
  Stack,
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

const App: React.FC = () => {
  const [serviceStatuses, setServiceStatuses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Simple service health check
  const checkServiceHealth = async (name: string, port: number) => {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
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
  const createOrderApi = async (amount: number) => {
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
      const errorMessage = error && error.message ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
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

  // Check service health on mount and periodically
  useEffect(() => {
    const checkAllServices = async () => {
      const services = [
        { name: 'Order Service', port: 3000 },
        { name: 'Payment Service', port: 3001 },
        { name: 'Orchestrator Service', port: 3002 },
        { name: 'WebSocket Service', port: 3003 },
      ];

      const results = await Promise.all(
        services.map(service => checkServiceHealth(service.name, service.port))
      );

      setServiceStatuses(results);
    };

    const loadOrders = async () => {
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    };

    checkAllServices();
    loadOrders();

    // Set up periodic checks
    const healthInterval = setInterval(checkAllServices, 30000);
    const ordersInterval = setInterval(loadOrders, 5000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(ordersInterval);
    };
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    setMessage(null);

    const result = await createOrderApi(parseFloat(amount));
    
    if (result.success) {
      setMessage({ type: 'success', text: `Order created successfully! Order ID: ${result.data?.orderId}` });
      setAmount('');
      // Refresh orders
      const ordersData = await fetchOrders();
      setOrders(ordersData);
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create order' });
    }

    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle color="success" />;
      case 'UNHEALTHY':
        return <Error color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' => {
    switch (status) {
      case 'HEALTHY': return 'success';
      case 'UNHEALTHY': return 'error';
      default: return 'warning';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Dashboard sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Saga Microservices Dashboard
            </Typography>
            <Typography variant="body2">
              Real-time Transaction Orchestration
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 2 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <Stack spacing={3}>
            {/* Service Status Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Service Health Status
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 2,
                  '& > *': { minWidth: 280, flex: 1 }
                }}
              >
                {serviceStatuses.map((service) => (
                  <Card variant="outlined" key={service.name}>
                    <CardContent sx={{ pb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        {getStatusIcon(service.status)}
                        <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                          {service.name}
                        </Typography>
                        <Chip
                          label={service.status}
                          color={getStatusColor(service.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Port: {service.port}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>

            {/* Create Order and Orders List Sections */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {/* Create Order Section */}
              <Paper sx={{ p: 3, minWidth: 320, flex: '0 0 300px' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Order
                </Typography>
                <Box component="form" onSubmit={handleCreateOrder}>
                  <TextField
                    label="Order Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    required
                    inputProps={{ min: 0.01, step: 0.01 }}
                    sx={{ mb: 2 }}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || !amount || parseFloat(amount) <= 0}
                    startIcon={<Add />}
                  >
                    {loading ? 'Creating Order...' : 'Create Order'}
                  </Button>
                </Box>
              </Paper>

              {/* Orders List Section */}
              <Paper sx={{ p: 3, flex: 1, minWidth: 400 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Orders ({orders.length})
                </Typography>
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {orders.length === 0 ? (
                    <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                      No orders yet. Create your first order to see it here.
                    </Typography>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 2,
                        '& > *': { minWidth: 280, flex: '1 1 300px' }
                      }}
                    >
                      {orders.slice(0, 10).map((order, index) => (
                        <Card variant="outlined" key={order._id || index}>
                          <CardContent>
                            <Typography variant="h6" component="div">
                              ${order.amount?.toFixed(2) || '0.00'}
                            </Typography>
                            <Typography color="text.secondary" gutterBottom>
                              Order ID: {order.orderId}
                            </Typography>
                            <Chip
                              label={order.status || 'PENDING'}
                              color={
                                order.status === 'COMPLETED' ? 'success' :
                                order.status === 'FAILED' ? 'error' : 'warning'
                              }
                              size="small"
                            />
                            {order.failureReason && (
                              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {order.failureReason}
                              </Typography>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Unknown'}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Box>

            {/* Instructions Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                How to Use This Dashboard
              </Typography>
              <Typography variant="body1" paragraph>
                This dashboard allows you to monitor and interact with the Saga microservices system:
              </Typography>
              <Typography variant="body2" component="div">
                <strong>1. Service Health:</strong> Monitor the status of all microservices (Order, Payment, Orchestrator, WebSocket)
                <br />
                <strong>2. Create Orders:</strong> Submit new orders to test the saga transaction flow
                <br />
                <strong>3. View Orders:</strong> See all created orders and their current status (PENDING, COMPLETED, FAILED)
                <br />
                <strong>4. Real-time Updates:</strong> Orders will update automatically as they progress through the saga workflow
              </Typography>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
