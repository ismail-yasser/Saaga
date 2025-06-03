@echo off
echo.
echo 🧪 Testing Saga Microservice Flow
echo ================================
echo.

echo Creating new order...
curl -X POST http://localhost:3000/createorder -H "Content-Type: application/json" -d "{\"name\":\"Saga Test Product\",\"itemCount\":1,\"amount\":199.99}"

echo.
echo.
echo ✅ Order creation request sent!
echo 📋 Check the terminal logs to see the saga flow:
echo    1. Order Service: Order created and sent to Orchestrator
echo    2. Orchestrator: Received order and sent to Payment Service  
echo    3. Payment Service: Processed payment and sent result to Orchestrator
echo    4. Orchestrator: Received payment result and sent completion to Order Service
echo    5. Order Service: Updated order status to COMPLETED or FAILED
echo.
pause
