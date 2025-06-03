import React from 'react';
import { DataGrid, GridColDef, GridValueGetter } from '@mui/x-data-grid';
import { Chip, Box } from '@mui/material';
import { Order, Transaction } from '../types';

interface TransactionHistoryProps {
  orders: Order[];
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ orders, transactions }) => {
  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'PROCESSING':
        return 'warning';
      default:
        return 'info';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'orderId',
      headerName: 'Order ID',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 100,
      renderCell: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'steps',
      headerName: 'Steps Completed',
      width: 150,
      valueGetter: (params: GridValueGetterParams) => {
        const transaction = transactions.find(t => t.orderId === params.row.orderId);
        if (!transaction) return '0/0';
        const completedSteps = transaction.steps.filter(s => s.status === 'COMPLETED').length;
        return `${completedSteps}/${transaction.steps.length}`;
      },
    },
    {
      field: 'failureReason',
      headerName: 'Failure Reason',
      width: 200,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) => {
        if (!params.value) return '-';
        return new Date(params.value).toLocaleString();
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 180,
      renderCell: (params) => {
        if (!params.value) return '-';
        return new Date(params.value).toLocaleString();
      },
    },
  ];

  const rows = orders.map((order, index) => ({
    id: order._id || index,
    orderId: order.orderId,
    amount: order.amount,
    status: order.status,
    failureReason: order.failureReason,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }));

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 }
          }
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
      />
    </Box>
  );
};

export default TransactionHistory;
