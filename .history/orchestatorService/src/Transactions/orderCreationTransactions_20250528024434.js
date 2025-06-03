const Producer = require('../../../kafkaBroker/kafkaHandler/routes');

// Transaction state management
const transactions = new Map();

module.exports = (message) => {
    console.log('Processing transaction message:', message);
    
    switch(message.type) {
        case 'ORDER_CREATED':
            handleOrderCreated(message);
            break;
        case 'PAYMENT_COMPLETED_STATE':
            handlePaymentCompleted(message);
            break;
        case 'PAYMENT_FAILED_STATE':
            handlePaymentFailed(message);
            break;
        default:
            console.log('Unknown message type:', message.type);
            break;    
    }
}

function handleOrderCreated(message) {
    try {
        console.log('Handling order created:', message);
        
        // Store transaction state
        transactions.set(message.payload.data.transactionId, {
            orderId: message.payload.data.id,
            status: 'PAYMENT_PENDING',
            amount: message.payload.data.amount
        });

        // Trigger payment execution
        Producer({
            topic: 'EXECUTE_PAYMENT',
            payload: {
                data: message.payload.data
            }
        });
    } catch (error) {
        console.error('Error handling order created:', error);
    }
}

function handlePaymentCompleted(message) {
    try {
        console.log('Handling payment completed:', message);
        
        const transactionId = message.payload.transactionId;
        const transaction = transactions.get(transactionId);
          if (transaction) {
            transaction.status = 'COMPLETED';
            
            // Notify order service that transaction is completed
            Producer({
                topic: 'ORDER_SERVICE',
                type: 'TRANSACTION_COMPLETED',
                payload: {
                    transactionId: transactionId,
                    orderId: transaction.orderId,
                    amount: transaction.amount
                }
            });
            
            console.log('✅ Transaction completed and order service notified');
            
            // Clean up transaction
            transactions.delete(transactionId);
        }
    } catch (error) {
        console.error('Error handling payment completed:', error);
    }
}

function handlePaymentFailed(message) {
    try {
        console.log('Handling payment failed:', message);
        
        const transactionId = message.payload.transactionId;
        const transaction = transactions.get(transactionId);
        
        if (transaction) {
            transaction.status = 'FAILED';
              // Notify order service that payment failed
            Producer({
                topic: 'ORDER_SERVICE',
                type: 'ORDER_PAYMENT_FAILED',
                payload: {
                    transactionId: transactionId,
                    orderId: transaction.orderId,
                    reason: message.payload.reason || 'Payment processing failed'
                }
            });
            
            // Clean up transaction
            transactions.delete(transactionId);
        }
    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}