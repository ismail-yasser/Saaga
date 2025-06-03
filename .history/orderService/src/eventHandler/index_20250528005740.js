const paymentCompleted = require('./paymentCompleted');

const EventHandler = (message) => {
    switch(message.type){
        case 'ORDER_PAYMENT_COMPLETED':
            paymentCompleted(message);
            break;
        case 'TRANSACTION_COMPLETED':
            // Handle transaction completion
            console.log('Transaction completed:', message);
            break;
        case 'TRANSACTION_FAILED':
            // Handle transaction failure
            console.log('Transaction failed:', message);
            break;
        default:
            break;    
    }
}

module.exports = EventHandler;