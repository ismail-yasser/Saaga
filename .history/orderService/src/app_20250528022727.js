const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const Consumer = require('../../kafkaBroker/kafkaHandler/Consumer');
const eventHandler = require('./eventHandler');
const CreateOrder = require('./Controller/createOrder');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

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
    console.log('📊 Database:', mongoose.connection.name);app.post('/createorder',CreateOrder);

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
    app.post('/createorder', (req, res) => {
        res.status(503).json({ 
            error: 'Database unavailable', 
            message: 'MongoDB connection failed' 
        });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`⚠️  Order Service running on port ${PORT} (DB offline)`);
    });
})



