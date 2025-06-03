const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Consumer = require('../../kafkaBroker/kafkaHandler/Consumer');
const eventHandler = require('./eventHandler');
const CreateOrder = require('./Controller/createOrder');
const app = express();

// CORS middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        service: 'Order Service',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Get all orders endpoint
app.get('/api/orders', async (req, res) => {
    try {
        const OrderModel = require('./Model/orderModel');
        const orders = await OrderModel.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Create order endpoint (updated path)
app.post('/api/orders', CreateOrder);
app.post('/createorder', CreateOrder); // Keep old endpoint for backward compatibility

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/orderdb";

console.log('🔍 Attempting to connect to MongoDB...');
console.log('📡 URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
}).then(data => {
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', mongoose.connection.name);

    const PORT = process.env.PORT || 3000;

    app.listen(PORT,() => {
        console.log(`Order Service is running on port ${PORT}`);
    })

    const consumer = new Consumer();    consumer.addTopics(["ORDER_SERVICE","SERVICE_REPLY"]).then(() => {
        consumer.consume(message => {
            console.log("consumed message",message);
            try {
                const parsedMessage = JSON.parse(message.value);
                eventHandler(parsedMessage);
            } catch (error) {
                console.error('Error parsing message:', error);
                console.log('Raw message:', message);
            }
        })
    }).catch(error => {
        console.error('Error setting up Kafka consumer:', error);
    });
    
})
.catch(err => {
    console.log('❌ MongoDB connection failed:');
    console.log('🚨 Error:', err.message);
    console.log('⚠️  Starting server without MongoDB...');
      // Start server anyway for testing
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`⚠️  Order Service running on port ${PORT} (DB offline)`);
    });
})



