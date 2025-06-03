const http = require('http');

console.log('🧪 Testing Saga Flow Step by Step...\n');

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

        console.log(`📦 Creating order: ${orderData.name}`);
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📡 Response Status: ${res.statusCode}`);
                console.log(`📡 Response Data: ${data}`);
                
                try {
                    const response = JSON.parse(data);
                    resolve({ status: res.statusCode, data: response });
                } catch (error) {
                    console.log(`⚠️  Raw response: ${data}`);
                    reject({ status: res.statusCode, error: error.message, raw: data });
                }
            });
        });

        req.on('error', (error) => {
            console.log(`❌ Connection error: ${error.message}`);
            reject({ error: error.message });
        });

        req.write(postData);
        req.end();
    });
}

async function testSingleOrder() {
    try {
        const order = { 
            name: "Saga Test Order", 
            itemCount: 2, 
            amount: 50 
        };
        
        const result = await createOrder(order);
        
        if (result.status === 200 || result.status === 201) {
            console.log('✅ Order created successfully!');
            console.log('📋 Order Details:', JSON.stringify(result.data, null, 2));
            
            if (result.data.order && result.data.order.transactionId) {
                console.log(`🔗 Transaction ID: ${result.data.order.transactionId}`);
                console.log('⏳ Waiting for saga processing...');
                
                // Wait and check if saga processing continues
                setTimeout(() => {
                    console.log('🔍 Saga processing should be happening in the background...');
                    console.log('📊 Check the service console windows for transaction logs!');
                }, 3000);
            }
        } else {
            console.log(`❌ Order creation failed with status: ${result.status}`);
        }
        
    } catch (error) {
        console.log('❌ Test failed:', error);
    }
}

testSingleOrder();
