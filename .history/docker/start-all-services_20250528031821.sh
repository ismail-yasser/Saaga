#!/bin/bash

echo "🚀 Starting Saga Microservices Container..."

# Wait for Kafka to be ready
echo "⏳ Waiting for Kafka to be ready..."
while ! nc -z kafka 9092; do
  sleep 1
done
echo "✅ Kafka is ready!"

# Start all services in background
echo "🔧 Starting all microservices..."

# Start Order Service
echo "🛒 Starting Order Service on port 3000..."
cd /app/orderService && PORT=3000 node src/app.js &
ORDER_PID=$!

# Start Payment Service  
echo "💳 Starting Payment Service on port 3001..."
cd /app/paymentService && PORT=3001 node src/app.js &
PAYMENT_PID=$!

# Start Orchestrator Service
echo "🎭 Starting Orchestrator Service on port 3002..."
cd /app/orchestatorService && PORT=3002 node src/bootstrap.js &
ORCHESTRATOR_PID=$!

# Start WebSocket Service
echo "🔌 Starting WebSocket Service on port 3003..."
cd /app/websocketService && PORT=3003 node server.js &
WEBSOCKET_PID=$!

# Start Frontend (served by nginx or serve)
echo "🌐 Starting Frontend on port 3004..."
cd /app/frontend && npx serve -s build -l 3004 &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    kill $ORDER_PID $PAYMENT_PID $ORCHESTRATOR_PID $WEBSOCKET_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap signals
trap cleanup SIGTERM SIGINT

echo "✅ All services started successfully!"
echo "📊 Service URLs:"
echo "   - Order Service: http://localhost:3000"
echo "   - Payment Service: http://localhost:3001" 
echo "   - Orchestrator Service: http://localhost:3002"
echo "   - WebSocket Service: http://localhost:3003"
echo "   - Frontend Dashboard: http://localhost:3004"
echo ""
echo "🎯 Ready to process saga transactions!"

# Wait for any process to exit
wait
