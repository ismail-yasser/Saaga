const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Atlas connection...');
console.log('📡 Connection string:', process.env.MONGODB_URI ? 'Found in .env' : 'Not found');

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/orderdb";
console.log('🎯 Attempting to connect to:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

mongoose.connect(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    connectTimeoutMS: 10000
}).then(() => {
    console.log('✅ MongoDB Atlas connection successful!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔗 Connected to:', mongoose.connection.host);
    process.exit(0);
}).catch(err => {
    console.log('❌ MongoDB connection failed:');
    console.log('🚨 Error:', err.message);
    if (err.code) {
        console.log('🔍 Error code:', err.code);
    }
    process.exit(1);
});

// Timeout handler
setTimeout(() => {
    console.log('⏰ Connection timeout - taking too long');
    process.exit(1);
}, 15000);
