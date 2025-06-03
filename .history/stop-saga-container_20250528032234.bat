@echo off
echo 🛑 Stopping Saga Microservices...
echo.

echo ⏳ Stopping all containers...
docker-compose down

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ All services stopped successfully!
    echo.
    echo 🧹 To clean up (remove containers and images):
    echo    docker-compose down --rmi all
    echo.
    echo 🗑️ To remove all data volumes:
    echo    docker-compose down -v
    echo.
) else (
    echo.
    echo ❌ Error stopping services
    exit /b 1
)

pause
