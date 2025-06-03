@echo off
echo 🔧 Running Saga Container in Development Mode...
echo.

echo ⚠️  Note: This runs the saga container without Kafka for quick testing
echo     For full functionality, use run-saga-container.bat
echo.

echo ⏳ Starting saga container...
docker run -d ^
  --name saga-dev ^
  -p 3000:3000 ^
  -p 3001:3001 ^
  -p 3002:3002 ^
  -p 3003:3003 ^
  -p 3004:3004 ^
  -e KAFKA_BROKER=localhost:9092 ^
  -e NODE_ENV=development ^
  saga-microservices

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Saga container started in development mode!
    echo.
    echo 📊 Service URLs:
    echo    - Order Service: http://localhost:3000
    echo    - Payment Service: http://localhost:3001
    echo    - Orchestrator Service: http://localhost:3002
    echo    - WebSocket Service: http://localhost:3003
    echo    - Frontend Dashboard: http://localhost:3004
    echo.
    echo 🔍 To view logs:
    echo    docker logs -f saga-dev
    echo.
    echo 🛑 To stop:
    echo    docker stop saga-dev && docker rm saga-dev
    echo.
) else (
    echo.
    echo ❌ Failed to start container
    exit /b 1
)

pause
