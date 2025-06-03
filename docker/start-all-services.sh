#!/bin/bash

echo "🚀 Starting Saga Microservices Container..."

# Create logs directory
mkdir -p /app/logs

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
while ! nc -z kafka 9092; do
  echo "Kafka not ready, waiting..."
  sleep 2
done
echo "✅ Kafka is ready!"

# Load environment variables
if [ -f /app/.env ]; then
    export $(cat /app/.env | grep -v '^#' | xargs)
fi

# Start all services in background with logging
echo "🔧 Starting all microservices..."

# Start Order Service
echo "🛒 Starting Order Service on port 3000..."
cd /app/orderService && PORT=3000 node src/app.js > /app/logs/order-service.log 2>&1 &
ORDER_PID=$!

# Wait a moment between services
sleep 2

# Start Payment Service  
echo "💳 Starting Payment Service on port 3001..."
cd /app/paymentService && PORT=3001 node src/app.js > /app/logs/payment-service.log 2>&1 &
PAYMENT_PID=$!

sleep 2

# Start Orchestrator Service
echo "🎭 Starting Orchestrator Service on port 3002..."
cd /app/orchestatorService && PORT=3002 node src/bootstrap.js > /app/logs/orchestrator-service.log 2>&1 &
ORCHESTRATOR_PID=$!

sleep 2

# Start WebSocket Service
echo "🔌 Starting WebSocket Service on port 3003..."
cd /app/websocketService && PORT=3003 node server.js > /app/logs/websocket-service.log 2>&1 &
WEBSOCKET_PID=$!

sleep 2

# Start Frontend (served by serve)
echo "🌐 Starting Frontend on port 3004..."
cd /app/frontend && npx serve -s build -l 3004 > /app/logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $ORDER_PID $PAYMENT_PID $ORCHESTRATOR_PID $WEBSOCKET_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

# Wait for services to start
echo "⏳ Waiting for services to initialize..."
sleep 10

echo "✅ All services started successfully!"
echo "📊 Service URLs:"
echo "   - Order Service: http://localhost:3000"
echo "   - Payment Service: http://localhost:3001" 
echo "   - Orchestrator Service: http://localhost:3002"
echo "   - WebSocket Service: http://localhost:3003"
echo "   - Frontend Dashboard: http://localhost:3004"
echo ""
echo "📝 Logs are available in /app/logs/"
echo "🎯 Ready to process saga transactions!"

# Wait for any process to exit
wait
