const paymentCompleted = require('./paymentCompleted');
const paymentFailed = require('./paymentFailed');

const EventHandler = (message) => {
    console.log('Order Service received message:', message);
    
    switch(message.type){
        case 'ORDER_PAYMENT_COMPLETED':
            paymentCompleted(message);
            break;
        case 'ORDER_PAYMENT_FAILED':
            paymentFailed(message);
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
            console.log('Unknown message type:', message.type);
            break;    
    }
}

module.exports = EventHandler;