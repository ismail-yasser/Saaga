import axios from 'axios';
import { Order, CreateOrderRequest, ServiceStatus, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order Service API
export const orderService = {
  // Create a new order
  createOrder: async (orderData: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.post('/api/orders', orderData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create order',
      };
    }
  },

  // Get all orders
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    try {
      const response = await api.get('/api/orders');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch orders',
      };
    }
  },

  // Get order by ID
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    try {
      const response = await api.get(`/api/orders/${orderId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch order',
      };
    }
  },
};

// Health Check Service
export const healthService = {
  checkServiceHealth: async (serviceName: string, port: number): Promise<ServiceStatus> => {
    const serviceUrls: { [key: string]: string } = {
      'Order Service': `http://localhost:${port}/health`,
      'Payment Service': `http://localhost:${port}/health`,
      'Orchestrator Service': `http://localhost:${port}/health`,
    };

    const url = serviceUrls[serviceName] || `http://localhost:${port}/health`;
    const startTime = Date.now();

    try {
      const response = await axios.get(url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;
      
      return {
        name: serviceName,
        status: response.status === 200 ? 'HEALTHY' : 'UNHEALTHY',
        lastCheck: new Date().toISOString(),
        url,
        responseTime,
      };
    } catch (error) {
      return {
        name: serviceName,
        status: 'UNHEALTHY',
        lastCheck: new Date().toISOString(),
        url,
        responseTime: Date.now() - startTime,
      };
    }
  },

  checkAllServices: async (): Promise<ServiceStatus[]> => {
    const services = [
      { name: 'Order Service', port: 3000 },
      { name: 'Payment Service', port: 3001 },
      { name: 'Orchestrator Service', port: 3002 },
    ];

    const healthChecks = services.map(service =>
      healthService.checkServiceHealth(service.name, service.port)
    );

    return Promise.all(healthChecks);
  },
};

export default api;
