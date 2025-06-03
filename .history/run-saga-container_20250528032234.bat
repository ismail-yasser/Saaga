@echo off
echo 🚀 Starting Saga Microservices with Docker Compose...
echo.

echo ⏳ Starting all services (Kafka + Saga Container)...
docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ All services started successfully!
    echo.
    echo 📊 Service URLs:
    echo    - Order Service: http://localhost:3000
    echo    - Payment Service: http://localhost:3001
    echo    - Orchestrator Service: http://localhost:3002
    echo    - WebSocket Service: http://localhost:3003
    echo    - Frontend Dashboard: http://localhost:3004
    echo.
    echo 🔍 To view logs:
    echo    docker-compose logs -f saga
    echo.
    echo 🛑 To stop all services:
    echo    docker-compose down
    echo.
) else (
    echo.
    echo ❌ Failed to start services
    exit /b 1
)

pause
