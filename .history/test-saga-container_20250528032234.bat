@echo off
echo 🧪 Testing Saga Container Services...
echo.

echo ⏳ Checking if services are running...
echo.

echo 🛒 Testing Order Service (port 3000)...
curl -s http://localhost:3000/health
echo.

echo 💳 Testing Payment Service (port 3001)...
curl -s http://localhost:3001/health
echo.

echo 🎭 Testing Orchestrator Service (port 3002)...
curl -s http://localhost:3002/health
echo.

echo 🔌 Testing WebSocket Service (port 3003)...
curl -s http://localhost:3003/health
echo.

echo 🌐 Testing Frontend (port 3004)...
curl -s -I http://localhost:3004 | findstr "200"
echo.

echo 📊 Testing complete saga flow...
echo Creating test order...

curl -X POST http://localhost:3000/api/orders ^
  -H "Content-Type: application/json" ^
  -d "{\"customerId\": \"test-customer\", \"items\": [{\"name\": \"Test Product\", \"price\": 99.99, \"quantity\": 1}], \"totalAmount\": 99.99}"

echo.
echo.
echo ✅ Container test completed!
echo.
echo 🔍 To view logs:
echo    docker-compose logs saga
echo.

pause
