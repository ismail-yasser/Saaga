const orderModel = require('../Model/orderModel');

module.exports = async (message) => {
    try {
        const transactionId = message.payload.transactionId;
        const reason = message.payload.reason || 'Payment processing failed';
        
        console.log('Updating order status to failed for transaction:', transactionId);
        
        const order = await orderModel.findOneAndUpdate(
            { transactionId: transactionId },
            { 
                status: 'PAYMENT_FAILED',
                failureReason: reason
            },
            { new: true }
        );

        if (order) {
            console.log('Order status updated to failed:', order);
        } else {
            console.warn('Order not found for transaction:', transactionId);
        }
    } catch (e) {
        console.error('Error updating order status to failed:', e);
    }
}
