const paymentCompleted = require('./paymentCompleted');
const paymentFailed = require('./paymentFailed');

const EventHandler = async (message) => {
    console.log('Order Service received message:', message);
    
    try {
        switch(message.type){
            case 'ORDER_PAYMENT_COMPLETED':
                await paymentCompleted(message);
                break;
            case 'ORDER_PAYMENT_FAILED':
                await paymentFailed(message);
                break;            case 'TRANSACTION_COMPLETED':
                // Handle transaction completion - update order to completed
                await updateOrderStatus(message, 'COMPLETED');
                break;
            case 'TRANSACTION_FAILED':
                // Handle transaction failure - update order to failed
                await updateOrderStatus(message, 'FAILED', message.reason);
                break;
            default:
                console.log('Unknown message type:', message.type);
                break;    
        }
    } catch (error) {
        console.error('Error in EventHandler:', error);
    }
}

module.exports = EventHandler;