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

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'unhealthy';
  port: number;
}

interface Order {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt?: string;
  failureReason?: string;
}

const App: React.FC = () => {
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Simple service health check
  const checkServiceHealth = async (name: string, port: number): Promise<ServiceStatus> => {
    try {
      const response = await fetch(`http://localhost:${port}/health`);
      return {
        name,
        status: response.ok ? 'healthy' : 'unhealthy',
        port,
      };
    } catch (error) {
      return {
        name,
        status: 'unhealthy',
        port,
      };
    }
  };

  // Load service statuses
  const loadServiceStatuses = async () => {
    const services = [
      { name: 'Order Service', port: 3000 },
      { name: 'Payment Service', port: 3001 },
      { name: 'Orchestrator Service', port: 3002 },
      { name: 'WebSocket Service', port: 3003 },
    ];

    const statuses = await Promise.all(
      services.map(service => checkServiceHealth(service.name, service.port))
    );
    setServiceStatuses(statuses);
  };

  // Load orders
  const loadOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  // Create new order
  const createOrder = async () => {
    if (!amount || isNaN(Number(amount))) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      if (response.ok) {
        const newOrder = await response.json();
        setOrders(prev => [newOrder, ...prev]);
        setAmount('');
        setMessage({ type: 'success', text: 'Order created successfully!' });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create order. Make sure services are running.' });
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadServiceStatuses();
    loadOrders();

    // Refresh data every 5 seconds
    const interval = setInterval(() => {
      loadServiceStatuses();
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Stack spacing={4}>
            {/* Message Display */}
            {message && (
              <Alert severity={message.type} onClose={() => setMessage(null)}>
                {message.text}
              </Alert>
            )}

            {/* Service Status Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Service Health Status
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {serviceStatuses.map((service) => (
                  <Card key={service.name} sx={{ minWidth: 200 }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {service.status === 'healthy' ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Error color="error" />
                        )}
                        <Box>
                          <Typography variant="h6" component="div">
                            {service.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Port: {service.port}
                          </Typography>
                          <Chip
                            label={service.status}
                            color={service.status === 'healthy' ? 'success' : 'error'}
                            size="small"
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Paper>

            {/* Order Creation Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Create New Order
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter order amount"
                  sx={{ minWidth: 200 }}
                />
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={createOrder}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Order'}
                </Button>
              </Stack>
            </Paper>

            {/* Orders List Section */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Orders ({orders.length})
              </Typography>
              <Box>
                {orders.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    No orders found. Create your first order above!
                  </Typography>
                ) : (
                  <Box>
                    {orders.map((order) => (
                      <Card key={order.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="h6">
                                Order #{order.id}
                              </Typography>
                              <Typography variant="body1">
                                Amount: ${order.amount}
                              </Typography>
                            </Box>
                            <Box>
                              <Chip
                                label={order.status}
                                color={
                                  order.status === 'COMPLETED' ? 'success' :
                                  order.status === 'FAILED' ? 'error' : 'warning'
                                }
                                size="small"
                              />
                            </Box>
                          </Stack>
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
