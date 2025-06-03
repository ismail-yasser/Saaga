import React, { useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Box, Typography, Chip } from '@mui/material';
import { Transaction, ServiceStatus } from '../types';

interface SagaWorkflowProps {
  transactions: Transaction[];
  serviceStatuses: ServiceStatus[];
}

const SagaWorkflow: React.FC<SagaWorkflowProps> = ({ transactions, serviceStatuses }) => {
  const { nodes, edges } = useMemo(() => {
    // Create nodes for each service
    const serviceNodes: Node[] = [
      {
        id: 'order-service',
        type: 'default',
        position: { x: 100, y: 200 },
        data: {
          label: (
            <Box textAlign="center">
              <Typography variant="h6">Order Service</Typography>
              <ServiceStatusChip serviceName="Order Service" statuses={serviceStatuses} />
            </Box>
          ),
        },
        style: {
          background: '#e3f2fd',
          border: '2px solid #1976d2',
          borderRadius: 8,
          padding: 10,
          minWidth: 150,
        },
      },
      {
        id: 'orchestrator',
        type: 'default',
        position: { x: 400, y: 100 },
        data: {
          label: (
            <Box textAlign="center">
              <Typography variant="h6">Orchestrator</Typography>
              <ServiceStatusChip serviceName="Orchestrator Service" statuses={serviceStatuses} />
            </Box>
          ),
        },
        style: {
          background: '#f3e5f5',
          border: '2px solid #7b1fa2',
          borderRadius: 8,
          padding: 10,
          minWidth: 150,
        },
      },
      {
        id: 'payment-service',
        type: 'default',
        position: { x: 700, y: 200 },
        data: {
          label: (
            <Box textAlign="center">
              <Typography variant="h6">Payment Service</Typography>
              <ServiceStatusChip serviceName="Payment Service" statuses={serviceStatuses} />
            </Box>
          ),
        },
        style: {
          background: '#e8f5e8',
          border: '2px solid #388e3c',
          borderRadius: 8,
          padding: 10,
          minWidth: 150,
        },
      },
    ];

    // Create edges showing the flow
    const serviceEdges: Edge[] = [
      {
        id: 'order-to-orchestrator',
        source: 'order-service',
        target: 'orchestrator',
        label: 'Order Created',
        type: 'smoothstep',
        style: { strokeWidth: 2 },
        labelStyle: { fontSize: 12 },
      },
      {
        id: 'orchestrator-to-payment',
        source: 'orchestrator',
        target: 'payment-service',
        label: 'Execute Payment',
        type: 'smoothstep',
        style: { strokeWidth: 2 },
        labelStyle: { fontSize: 12 },
      },
      {
        id: 'payment-to-orchestrator',
        source: 'payment-service',
        target: 'orchestrator',
        label: 'Payment Result',
        type: 'smoothstep',
        style: { strokeWidth: 2, strokeDasharray: '5,5' },
        labelStyle: { fontSize: 12 },
      },
      {
        id: 'orchestrator-to-order',
        source: 'orchestrator',
        target: 'order-service',
        label: 'Transaction Result',
        type: 'smoothstep',
        style: { strokeWidth: 2, strokeDasharray: '5,5' },
        labelStyle: { fontSize: 12 },
      },
    ];

    // Add transaction nodes if there are active transactions
    const latestTransactions = transactions.slice(0, 3); // Show latest 3 transactions
    const transactionNodes: Node[] = latestTransactions.map((transaction, index) => ({
      id: `transaction-${transaction.transactionId}`,
      type: 'default',
      position: { x: 400, y: 300 + (index * 80) },
      data: {
        label: (
          <Box textAlign="center" p={1}>
            <Typography variant="body2" fontWeight="bold">
              {transaction.orderId.slice(-8)}
            </Typography>
            <Chip
              label={transaction.status}
              color={getTransactionStatusColor(transaction.status)}
              size="small"
            />
            <Typography variant="caption" display="block">
              ${transaction.amount}
            </Typography>
          </Box>
        ),
      },
      style: {
        background: getTransactionBackground(transaction.status),
        border: `2px solid ${getTransactionBorderColor(transaction.status)}`,
        borderRadius: 8,
        padding: 5,
        minWidth: 120,
      },
    }));

    return {
      nodes: [...serviceNodes, ...transactionNodes],
      edges: serviceEdges,
    };
  }, [transactions, serviceStatuses]);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

// Helper component for service status
const ServiceStatusChip: React.FC<{ serviceName: string; statuses: ServiceStatus[] }> = ({
  serviceName,
  statuses,
}) => {
  const status = statuses.find(s => s.name === serviceName);
  if (!status) return <Chip label="Unknown" color="warning" size="small" />;

  const color = status.status === 'HEALTHY' ? 'success' : 'error';
  return <Chip label={status.status} color={color} size="small" />;
};

// Helper functions
const getTransactionStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
  switch (status) {
    case 'COMPLETED': return 'success';
    case 'FAILED': return 'error';
    case 'PROCESSING': return 'warning';
    default: return 'info';
  }
};

const getTransactionBackground = (status: string): string => {
  switch (status) {
    case 'COMPLETED': return '#e8f5e8';
    case 'FAILED': return '#ffebee';
    case 'PROCESSING': return '#fff3e0';
    default: return '#f5f5f5';
  }
};

const getTransactionBorderColor = (status: string): string => {
  switch (status) {
    case 'COMPLETED': return '#4caf50';
    case 'FAILED': return '#f44336';
    case 'PROCESSING': return '#ff9800';
    default: return '#9e9e9e';
  }
};

export default SagaWorkflow;
