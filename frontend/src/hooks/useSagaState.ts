import { useState, useEffect, useCallback } from 'react';
import { Order, Transaction, ServiceStatus, SagaEvent } from '../types';
import { orderService, healthService } from '../services/api';
import io, { Socket } from 'socket.io-client';

export const useSagaState = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [sagaEvents, setSagaEvents] = useState<SagaEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection for real-time updates
  useEffect(() => {
    const socketInstance = io('http://localhost:3003', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to saga events server');
    });

    socketInstance.on('saga-event', (event: SagaEvent) => {
      setSagaEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events
      
      // Update transactions based on events
      if (event.type.includes('ORDER') || event.type.includes('PAYMENT') || event.type.includes('TRANSACTION')) {
        updateTransactionFromEvent(event);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from saga events server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Update transaction state from saga events
  const updateTransactionFromEvent = useCallback((event: SagaEvent) => {
    setTransactions(prev => {
      const existing = prev.find(t => t.orderId === event.payload.orderId);
      
      if (existing) {
        const updatedSteps = [...existing.steps];
        const newStep = {
          step: event.type,
          status: getStepStatusFromEvent(event.type),
          timestamp: event.timestamp,
          service: event.service,
          message: event.payload.message || '',
        };
        
        updatedSteps.push(newStep);
        
        return prev.map(t => 
          t.orderId === event.payload.orderId 
            ? { ...t, steps: updatedSteps, status: getTransactionStatusFromSteps(updatedSteps) }
            : t
        );
      } else if (event.type === 'ORDER_CREATED') {
        // Create new transaction
        const newTransaction: Transaction = {
          transactionId: event.payload.transactionId || `tx-${Date.now()}`,
          orderId: event.payload.orderId,
          amount: event.payload.amount,
          status: 'PENDING',
          createdAt: event.timestamp,
          steps: [{
            step: event.type,
            status: 'COMPLETED' as const,
            timestamp: event.timestamp,
            service: event.service,
            message: event.payload.message || 'Order created successfully',
          }],
        };
        
        return [newTransaction, ...prev];
      }
      
      return prev;
    });
  }, []);

  // Helper functions
  const getStepStatusFromEvent = (eventType: string): 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' => {
    if (eventType.includes('FAILED')) return 'FAILED';
    if (eventType.includes('COMPLETED')) return 'COMPLETED';
    if (eventType.includes('PROCESSING') || eventType.includes('EXECUTING')) return 'PROCESSING';
    return 'PENDING';
  };

  const getTransactionStatusFromSteps = (steps: any[]): 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' => {
    if (steps.some(s => s.status === 'FAILED')) return 'FAILED';
    if (steps.some(s => s.step.includes('TRANSACTION_COMPLETED'))) return 'COMPLETED';
    if (steps.some(s => s.status === 'PROCESSING')) return 'PROCESSING';
    return 'PENDING';
  };

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders();
      if (response.success && response.data) {
        setOrders(response.data);
      } else {
        setError(response.error || 'Failed to fetch orders');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create order
  const createOrder = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.createOrder({ amount });
      if (response.success && response.data) {
        await fetchOrders(); // Refresh orders list
        return response.data;
      } else {
        setError(response.error || 'Failed to create order');
        return null;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchOrders]);

  // Check service health
  const checkServiceHealth = useCallback(async () => {
    try {
      const statuses = await healthService.checkAllServices();
      setServiceStatuses(statuses);
    } catch (err: any) {
      console.error('Failed to check service health:', err);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchOrders();
    checkServiceHealth();
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(checkServiceHealth, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [fetchOrders, checkServiceHealth]);

  return {
    orders,
    transactions,
    serviceStatuses,
    sagaEvents,
    loading,
    error,
    createOrder,
    fetchOrders,
    checkServiceHealth,
  };
};
