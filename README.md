# Saga Pattern Implementation - Node.js Microservices

![Implementation](./saga-nodejs.png)

## Overview

This project implements the **Saga Pattern** using Node.js microservices with Apache Kafka as the message broker. The system handles distributed transactions across multiple services with proper compensation mechanisms.

## Architecture

### Services
- **Order Service** (Port 3000): Handles order creation and management
- **Payment Service**: Processes payments with success/failure simulation
- **Orchestrator Service**: Coordinates saga transactions and compensations
- **Kafka Broker**: Message routing and event streaming

### Saga Flow
1. **Order Creation**: Client creates order via REST API
2. **Transaction Start**: Order service publishes ORDER_CREATED event
3. **Payment Processing**: Orchestrator triggers payment execution
4. **Completion/Compensation**: Based on payment result, order status is updated

## Prerequisites

- [Apache Kafka](https://kafka.apache.org/downloads)
- [Node.js](https://nodejs.org/en/download/) (v14+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (for Order Service)

## Setup

### 1. Kafka Setup

Start Zookeeper:
```bash
<Path to kafka>/bin/zookeeper-server-start.sh <Path to Kafka>/config/zookeeper.properties
```

Start Kafka Server:
```bash
<Path to kafka>/bin/kafka-server-start.sh <Path to Kafka>/config/server.properties
```

### 2. MongoDB Setup
```bash
mongod --dbpath <your-db-path>
```

### 3. Service Dependencies

Install dependencies for all services:
```bash
cd kafkaBroker && npm install
cd ../orchestatorService && npm install
cd ../orderService && npm install
cd ../paymentService && npm install
```

## Running the System

### Option 1: Automated Startup (Windows)
```bash
start-all.bat
```

### Option 2: Manual Startup

1. **Start Kafka Topics**:
```bash
cd kafkaBroker
node kafkaBootstrap.js
```

2. **Start Orchestrator Service**:
```bash
cd orchestatorService
npm run dev
```

3. **Start Order Service**:
```bash
cd orderService
npm run dev
```

4. **Start Payment Service**:
```bash
cd paymentService
npm run dev
```

## Testing

### Using Test Script
```bash
node test-saga.js
```

### Manual API Testing

Create an order:
```bash
curl -X POST http://localhost:3000/createorder \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Order",
    "itemCount": 5,
    "amount": 100
  }'
```

### Expected Response
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "60f7b1234567890123456789",
    "name": "Test Order",
    "itemCount": 5,
    "amount": 100,
    "transactionId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "status": "PENDING"
  }
}
```

## Features Implemented

### ✅ Fixed Issues
- **Missing Module Exports**: Fixed event handler exports
- **Enhanced Error Handling**: Added try-catch blocks and proper error logging
- **Payment Success/Failure**: 80% success rate simulation with proper failure handling
- **Transaction State Management**: Orchestrator tracks transaction states
- **Compensation Logic**: Handles rollbacks when payments fail
- **Improved API**: Better REST API with validation and error responses

### 🔄 Saga Flow
1. **Order Created** → **Payment Triggered**
2. **Payment Success** → **Order Status: PAYMENT_COMPLETED**
3. **Payment Failure** → **Order Status: PAYMENT_FAILED**

### 📊 Order Statuses
- `PENDING`: Order created, payment processing
- `PAYMENT_COMPLETED`: Payment successful
- `PAYMENT_FAILED`: Payment failed with reason

## Kafka Topics

- `ORDER_SERVICE`: Order-related events
- `PAYMENT_SERVICE`: Payment processing events
- `ORCHESTATOR_SERVICE`: Transaction coordination
- `STOCK_SERVICE`: Reserved for future stock management

## Project Structure
```
├── kafkaBroker/          # Kafka setup and message routing
├── orchestatorService/   # Saga coordination
├── orderService/         # Order management + REST API
├── paymentService/       # Payment processing
├── start-all.bat         # Automated startup script
└── test-saga.js          # Test automation script
```

## Monitoring

Watch the console logs of each service to see the saga flow in action:
- Order Service: Order creation and status updates
- Orchestrator: Transaction coordination
- Payment Service: Payment processing results

## Troubleshooting

### Common Issues
1. **Port 3000 in use**: Stop other Node.js processes
2. **MongoDB connection**: Ensure MongoDB is running
3. **Kafka connection**: Verify Kafka and Zookeeper are running
4. **Missing dependencies**: Run `npm install` in each service directory

### Logs Location
Check console output for each service for detailed logging and error messages.