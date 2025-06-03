const http = require('http');

// Simple connectivity test
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET',
    timeout: 5000
};

console.log('Testing Order Service connectivity...');

const req = http.request(options, (res) => {
    console.log(`✅ Order Service is responding! Status: ${res.statusCode}`);
    
    // Now test the create order endpoint
    testCreateOrder();
});

req.on('error', (error) => {
    console.log(`❌ Connection failed: ${error.message}`);
});

req.on('timeout', () => {
    console.log('⏰ Connection timeout');
    req.destroy();
});

req.end();

function testCreateOrder() {
    const orderData = JSON.stringify({
        name: "Simple Test Order",
        itemCount: 1,
        amount: 25
    });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/createorder',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(orderData)
        }
    };

    console.log('\n📦 Testing order creation...');
    
    const req = http.request(options, (res) => {
        let data = '';
        
        console.log(`📡 Response status: ${res.statusCode}`);
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('📡 Response body:', data);
            
            if (res.statusCode === 200 || res.statusCode === 201) {
                try {
                    const response = JSON.parse(data);
                    console.log('✅ Order created successfully!');
                    console.log('📋 Order details:', JSON.stringify(response, null, 2));
                } catch (e) {
                    console.log('⚠️  Response is not JSON:', data);
                }
            } else {
                console.log('❌ Order creation failed');
            }
        });
    });

    req.on('error', (error) => {
        console.log(`❌ Order creation error: ${error.message}`);
    });

    req.write(orderData);
    req.end();
}
