const http = require('http');
const { exec } = require('child_process');

console.log('🔍 Saga Microservice Health Check\n');

// Check if services are running
async function checkService(name, port) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            method: 'GET',
            timeout: 2000
        }, (res) => {
            console.log(`✅ ${name} is running on port ${port}`);
            resolve(true);
        });
        
        req.on('error', () => {
            console.log(`❌ ${name} is not running on port ${port}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            console.log(`⏰ ${name} timeout on port ${port}`);
            resolve(false);
        });
        
        req.end();
    });
}

// Check MongoDB connection
function checkMongoDB() {
    return new Promise((resolve) => {
        exec('mongo --eval "db.adminCommand(\'ismaster\')"', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ MongoDB is not running');
                resolve(false);
            } else {
                console.log('✅ MongoDB is running');
                resolve(true);
            }
        });
    });
}

async function runHealthCheck() {
    console.log('Checking services...\n');
    
    // Check MongoDB
    await checkMongoDB();
    
    // Check Order Service
    const orderService = await checkService('Order Service', 3000);
    
    console.log('\n📊 Health Check Summary:');
    console.log('========================');
    
    if (orderService) {
        console.log('🎉 System is ready for testing!');
        console.log('\nTo test the saga flow:');
        console.log('node test-saga.js');
        console.log('\nOr create an order manually:');
        console.log('curl -X POST http://localhost:3000/createorder -H "Content-Type: application/json" -d "{\\"name\\":\\"Test Order\\",\\"itemCount\\":5,\\"amount\\":100}"');
    } else {
        console.log('⚠️  Some services are not running.');
        console.log('\nTo start all services:');
        console.log('start-all.bat');
    }
}

runHealthCheck();
