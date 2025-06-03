import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  AccessTime,
} from '@mui/icons-material';
import { ServiceStatus as ServiceStatusType } from '../types';

interface ServiceStatusProps {
  serviceStatuses: ServiceStatusType[];
}

const ServiceStatus: React.FC<ServiceStatusProps> = ({ serviceStatuses }) => {
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
      case 'HEALTHY':
        return 'success';
      case 'UNHEALTHY':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (serviceStatuses.length === 0) {
    return (
      <Box>
        <LinearProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Checking service health...
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {serviceStatuses.map((service) => (
        <Grid item xs={12} sm={6} md={4} key={service.name}>
          <Card variant="outlined">
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
                URL: {service.url}
              </Typography>
              
              {service.responseTime && (
                <Box display="flex" alignItems="center" mt={1}>
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {service.responseTime}ms
                  </Typography>
                </Box>
              )}
              
              <Typography variant="caption" color="text.secondary">
                Last checked: {new Date(service.lastCheck).toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceStatus;
