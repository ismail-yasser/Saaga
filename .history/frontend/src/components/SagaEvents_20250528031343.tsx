import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import {
  PlayArrow,
  CheckCircle,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { SagaEvent } from '../types';

interface SagaEventsProps {
  events: SagaEvent[];
}

const SagaEvents: React.FC<SagaEventsProps> = ({ events }) => {
  const getEventIcon = (eventType: string) => {
    if (eventType.includes('FAILED')) {
      return <Error color="error" />;
    }
    if (eventType.includes('COMPLETED')) {
      return <CheckCircle color="success" />;
    }
    if (eventType.includes('PROCESSING') || eventType.includes('EXECUTING')) {
      return <Warning color="warning" />;
    }
    return <PlayArrow color="info" />;
  };

  const getEventColor = (eventType: string): 'success' | 'error' | 'warning' | 'info' => {
    if (eventType.includes('FAILED')) return 'error';
    if (eventType.includes('COMPLETED')) return 'success';
    if (eventType.includes('PROCESSING') || eventType.includes('EXECUTING')) return 'warning';
    return 'info';
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (events.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Info color="action" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No events yet. Create an order to see real-time saga events.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List>
        {events.slice(0, 20).map((event, index) => (
          <ListItem key={index} sx={{ px: 0 }}>
            <Paper variant="outlined" sx={{ width: '100%', p: 1 }}>
              <Box display="flex" alignItems="flex-start" gap={1}>
                <ListItemIcon sx={{ minWidth: 'auto', mt: 0.5 }}>
                  {getEventIcon(event.type)}
                </ListItemIcon>
                
                <Box flexGrow={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Chip
                      label={formatEventType(event.type)}
                      color={getEventColor(event.type)}
                      size="small"
                    />
                    <Chip
                      label={event.service}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </Typography>
                  
                  {event.payload && (
                    <Box mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        Order ID: {event.payload.orderId || 'N/A'}
                        {event.payload.amount && ` • Amount: $${event.payload.amount}`}
                        {event.payload.transactionId && ` • TX: ${event.payload.transactionId.slice(-8)}`}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SagaEvents;
