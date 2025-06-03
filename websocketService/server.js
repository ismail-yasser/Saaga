const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { kafka } = require('../kafkaBroker/kafkaHandler/Consumer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'WebSocket Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Kafka consumer for broadcasting events
const Consumer = require('../kafkaBroker/kafkaHandler/Consumer');

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Kafka consumer setup
try {
  const consumer = new Consumer();
  
  // Subscribe to all relevant topics
  consumer.addTopics([
    "ORDER_SERVICE", 
    "PAYMENT_SERVICE", 
    "ORCHESTATOR_SERVICE", 
    "SERVICE_REPLY"
  ]).then(() => {
    consumer.consume(message => {
      try {
        const parsedMessage = JSON.parse(message.value);
        
        // Create saga event
        const sagaEvent = {
          type: parsedMessage.type || 'UNKNOWN_EVENT',
          payload: parsedMessage,
          timestamp: new Date().toISOString(),
          service: getServiceFromTopic(message.topic) || 'Unknown',
        };
        
        console.log('Broadcasting saga event:', sagaEvent.type);
        
        // Broadcast to all connected clients
        io.emit('saga-event', sagaEvent);
        
      } catch (error) {
        console.error('Error processing Kafka message:', error);
      }
    });
  }).catch(error => {
    console.error('Error setting up Kafka consumer:', error);
  });
  
} catch (error) {
  console.error('Error initializing Kafka consumer:', error);
}

// Helper function to determine service from topic
function getServiceFromTopic(topic) {
  const topicMap = {
    'ORDER_SERVICE': 'Order Service',
    'PAYMENT_SERVICE': 'Payment Service',
    'ORCHESTATOR_SERVICE': 'Orchestrator Service',
    'SERVICE_REPLY': 'Service Reply'
  };
  
  return topicMap[topic] || topic;
}

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`WebSocket Service running on port ${PORT}`);
  console.log('Ready to broadcast saga events to connected clients');
});

module.exports = { app, server, io };
