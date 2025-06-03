const express = require('express');
const cors = require('cors');
const Consumer = require('../../kafkaBroker/kafkaHandler/Consumer');
const Transactions = require('./Transactions');

const app = express();

// CORS middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        service: 'Orchestrator Service',
        status: 'healthy',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3002;

try {
    // Start Express server
    app.listen(PORT, () => {
        console.log(`Orchestrator Service HTTP server running on port ${PORT}`);
    });

const consumer = new Consumer();

consumer.addTopics(["ORCHESTATOR_SERVICE", "ORDER_CREATION_TRANSACTIONS"]).then(() => {
    consumer.consume(message => {
        console.log("consumed message",message);
        try {
            const parsedMessage = JSON.parse(message.value);
            Transactions(parsedMessage);
        } catch (error) {
            console.error('Error parsing message:', error);
            console.log('Raw message:', message);
        }
    })
}).catch(error => {
    console.error('Error setting up Kafka consumer:', error);
})

console.log("Orchestator Started successfully");

}
catch(e){
    console.log(`Orchestrator Error ${e}`);
}