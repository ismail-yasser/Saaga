export interface Order {
  _id?: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  failureReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  transactionId: string;
  orderId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  steps: TransactionStep[];
}

export interface TransactionStep {
  step: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  timestamp: string;
  service: string;
  message?: string;
}

export interface ServiceStatus {
  name: string;
  status: 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';
  lastCheck: string;
  url: string;
  responseTime?: number;
}

export interface SagaEvent {
  type: string;
  payload: any;
  timestamp: string;
  service: string;
}

export interface CreateOrderRequest {
  amount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
