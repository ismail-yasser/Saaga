const orderModel = require('../Model/orderModel');

module.exports = async (message) => {
    try {
        const transactionId = message.payload.transactionId;
        console.log('Updating order status for transaction:', transactionId);
        
        const order = await orderModel.findOneAndUpdate(
            { transactionId: transactionId },
            { status: 'PAYMENT_COMPLETED' },
            { new: true }
        );

        if (order) {
            console.log('Order status updated successfully:', order);
        } else {
            console.warn('Order not found for transaction:', transactionId);
        }
    } catch (e) {
        console.error('Error updating order status:', e);
    }
}