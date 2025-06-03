# Saga Microservices Docker Container 🐳

This repository contains a comprehensive Docker container setup that runs all Saga microservices in a single "saga" container for easy deployment and testing.

## 🏗️ Container Architecture

The saga container includes:
- **Order Service** (Port 3000) - Handles order creation and management
- **Payment Service** (Port 3001) - Processes payments with saga patterns
- **Orchestrator Service** (Port 3002) - Coordinates saga transactions
- **WebSocket Service** (Port 3003) - Real-time event broadcasting
- **Frontend Dashboard** (Port 3004) - React-based monitoring interface

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose available

### 1. Build the Container
```cmd
build-saga-container.bat
```

### 2. Run with Kafka (Full Setup)
```cmd
run-saga-container.bat
```

### 3. Test the Services
```cmd
test-saga-container.bat
```

## 📊 Service URLs

Once running, access the services at:

- **Frontend Dashboard**: http://localhost:3004
- **Order Service API**: http://localhost:3000
- **Payment Service API**: http://localhost:3001
- **Orchestrator API**: http://localhost:3002
- **WebSocket Service**: http://localhost:3003

## 🔧 Development Mode

For quick testing without Kafka:
```cmd
run-saga-dev.bat
```

## 🛑 Stopping Services

```cmd
stop-saga-container.bat
```

## 📝 Logs and Monitoring

### View Container Logs
```cmd
docker-compose logs -f saga
```

### Individual Service Logs
```cmd
docker exec -it saga-microservices tail -f /app/logs/order-service.log
docker exec -it saga-microservices tail -f /app/logs/payment-service.log
docker exec -it saga-microservices tail -f /app/logs/orchestrator-service.log
docker exec -it saga-microservices tail -f /app/logs/websocket-service.log
docker exec -it saga-microservices tail -f /app/logs/frontend.log
```

### Health Checks
Each service provides a health endpoint:
- Order Service: http://localhost:3000/health
- Payment Service: http://localhost:3001/health
- Orchestrator Service: http://localhost:3002/health
- WebSocket Service: http://localhost:3003/health

## 🏗️ Container Structure

```
/app/
├── orderService/          # Order management service
├── paymentService/        # Payment processing service
├── orchestatorService/    # Saga orchestrator
├── websocketService/      # Real-time events
├── frontend/              # React dashboard
├── kafkaBroker/          # Kafka utilities
├── logs/                 # Service logs
├── start-all-services.sh # Startup script
└── .env                  # Environment config
```

## 🔄 Saga Flow Testing

### Create a Test Order
```cmd
curl -X POST http://localhost:3000/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\": \"test-customer\", \"items\": [{\"name\": \"Test Product\", \"price\": 99.99, \"quantity\": 1}], \"totalAmount\": 99.99}"
```

### Monitor Real-time Events
1. Open the frontend dashboard: http://localhost:3004
2. Watch the Saga Events panel for real-time updates
3. Monitor service statuses in the Service Status panel

## 🐳 Docker Commands

### Manual Container Operations
```cmd
# Build image
docker build -t saga-microservices .

# Run container
docker run -d --name saga-microservices -p 3000-3004:3000-3004 saga-microservices

# Stop container
docker stop saga-microservices

# Remove container
docker rm saga-microservices

# View logs
docker logs saga-microservices
```

### Docker Compose Operations
```cmd
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose up --build
```

## 🔧 Configuration

### Environment Variables (.env)
```
MONGODB_URI=mongodb+srv://...
KAFKA_BROKER=kafka:9092
ORDER_SERVICE_PORT=3000
PAYMENT_SERVICE_PORT=3001
ORCHESTRATOR_SERVICE_PORT=3002
WEBSOCKET_SERVICE_PORT=3003
FRONTEND_PORT=3004
```

### Service Dependencies
- **Kafka**: Required for inter-service communication
- **MongoDB**: Used by Order Service for data persistence
- **Node.js 18**: Runtime for all services
- **React**: Frontend framework

## 🎯 Use Cases

### Development
- Rapid testing of saga patterns
- Frontend development with real backend
- Integration testing

### Demo/Presentation
- Complete saga workflow demonstration
- Real-time monitoring capabilities
- Easy setup for presentations

### CI/CD Integration
- Containerized testing environment
- Automated saga flow validation
- Health check integration

## 🔍 Troubleshooting

### Container Won't Start
1. Check Docker is running
2. Verify ports 3000-3004 are available
3. Check logs: `docker-compose logs saga`

### Services Not Responding
1. Wait 60 seconds for full startup
2. Check health endpoints
3. Review individual service logs

### Kafka Connection Issues
1. Ensure Kafka container is running
2. Check network connectivity
3. Verify Kafka topics are created

## 📚 Additional Resources

- [Saga Pattern Documentation](./docs/saga-pattern.md)
- [API Documentation](./docs/api.md)
- [Frontend Guide](./frontend/README.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

---

🎉 **Happy Saga Testing!** Your complete microservices environment is now containerized and ready to go!
