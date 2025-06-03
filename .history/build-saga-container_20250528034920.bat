@echo off
echo 🐳 Building Saga Microservices Container...
echo.

echo ⏳ Building Docker image...
docker build -t saga-microservices .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Saga container built successfully!
    echo.
    echo 🚀 To run the container with Kafka:
    echo    docker-compose up
    echo.
    echo 🔧 To run just the saga container:
    echo    docker run -d --name saga-microservices -p 3000-3004:3000-3004 saga-microservices
    echo.
) else (
    echo.
    echo ❌ Failed to build container
    exit /b 1
)

pause
