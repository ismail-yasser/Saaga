@echo off
echo Starting Saga Microservices...
echo.

echo Starting Kafka Broker...
start "Kafka Broker" cmd /k "cd kafkaBroker && node kafkaBootstrap.js"
timeout /t 5

echo Starting Orchestrator Service...
start "Orchestrator Service" cmd /k "cd orchestatorService && npm run dev"
timeout /t 3

echo Starting Order Service...
start "Order Service" cmd /k "cd orderService && npm run dev"
timeout /t 3

echo Starting Payment Service...
start "Payment Service" cmd /k "cd paymentService && npm run dev"

echo.
echo All services started!
echo Order Service API available at: http://localhost:3000
echo.
echo To test the system, use:
echo curl -X POST http://localhost:3000/createorder -H "Content-Type: application/json" -d "{\"name\":\"Test Order\",\"itemCount\":5,\"amount\":100}"
echo.
pause
