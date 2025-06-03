const http = require('http');

// Test data
const orders = [
    { name: "Test Order 1", itemCount: 5, amount: 100 },
    { name: "Test Order 2", itemCount: 3, amount: 75 },
    { name: "Test Order 3", itemCount: 10, amount: 200 }
];

function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(orderData);
        
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/createorder',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({ status: res.statusCode, data: response });
                } catch (error) {
                    reject({ status: res.statusCode, error: error.message, raw: data });
                }
            });
        });

        req.on('error', (error) => {
            reject({ error: error.message });
        });

        req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('🚀 Starting Saga Microservice Tests...\n');
    
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        console.log(`📦 Creating order ${i + 1}: ${order.name}`);
        
        try {
            const result = await createOrder(order);
            console.log(`✅ Order created successfully:`, result.data);
            console.log(`   Transaction ID: ${result.data.order.transactionId}`);
            console.log(`   Status: ${result.data.order.status}\n`);
            
            // Wait a bit between orders to see the saga flow
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.log(`❌ Error creating order:`, error);
        }
    }
    
    console.log('🏁 Test completed! Check the service logs to see the saga flow.');
}

// Check if Order Service is running
function checkServices() {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            method: 'GET',
            timeout: 2000
        }, (res) => {
            resolve(true);
        });
        
        req.on('error', () => {
            reject(false);
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject(false);
        });
        
        req.end();
    });
}

// Main execution
checkServices()
    .then(() => {
        runTests();
    })
    .catch(() => {
        console.log('❌ Order Service is not running on port 3000');
        console.log('Please start the services first using: start-all.bat');
        console.log('Or manually start each service:');
        console.log('1. cd kafkaBroker && node kafkaBootstrap.js');
        console.log('2. cd orchestatorService && npm run dev');
        console.log('3. cd orderService && npm run dev');
        console.log('4. cd paymentService && npm run dev');
    });
