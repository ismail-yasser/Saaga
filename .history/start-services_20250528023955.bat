@echo off
echo Starting Node.js Saga Microservices...
echo.

echo Starting Orchestrator Service...
start "Orchestrator Service" cmd /k "cd orchestatorService && npm start"
timeout /t 3

echo Starting Order Service...
start "Order Service" cmd /k "cd orderService && npm start"
timeout /t 3

echo Starting Payment Service...
start "Payment Service" cmd /k "cd paymentService && npm start"
timeout /t 3

echo.
echo All services started! Check the individual terminal windows for logs.
echo.
echo To test the system:
echo curl -X POST http://localhost:3000/createorder -H "Content-Type: application/json" -d "{\"name\": \"Test Product\", \"itemCount\": 2, \"amount\": 100.50}"
echo.
pause
