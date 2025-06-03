const paymentCompleted = require('./paymentCompleted');
const paymentFailed = require('./paymentFailed');
const orderModel = require('../Model/orderModel');

// Helper function to update order status
const updateOrderStatus = async (message, status, reason = null) => {
    try {
        const transactionId = message.transactionId || message.payload?.transactionId;
        console.log(`Updating order status to ${status} for transaction:`, transactionId);
        
        const updateData = { status };
        if (reason) {
            updateData.failureReason = reason;
        }
        
        const order = await orderModel.findOneAndUpdate(
            { transactionId: transactionId },
            updateData,
            { new: true }
        );

        if (order) {
            console.log(`Order status updated to ${status}:`, order);
        } else {
            console.warn('Order not found for transaction:', transactionId);
        }
    } catch (error) {
        console.error(`Error updating order status to ${status}:`, error);
    }
};

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