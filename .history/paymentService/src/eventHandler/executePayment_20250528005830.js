const Producer = require('../../../kafkaBroker/kafkaHandler/routes');

module.exports = (data) => {
    console.log("Processing payment for data:", data);
    
    try {
        // Simulate payment processing logic
        const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo
        
        if (paymentSuccess) {
            console.log("Payment successful for transaction:", data.transactionId);
            
            // Send payment success event
            Producer({
                topic: 'PAYMENT_COMPLETED_STATE',
                type: 'PAYMENT_COMPLETED_STATE',
                payload: {
                    transactionId: data.transactionId,
                    orderId: data.id,
                    amount: data.amount,
                    status: 'SUCCESS'
                }
            });
        } else {
            console.log("Payment failed for transaction:", data.transactionId);
            
            // Send payment failure event
            Producer({
                topic: 'PAYMENT_FAILED_STATE',
                type: 'PAYMENT_FAILED_STATE',
                payload: {
                    transactionId: data.transactionId,
                    orderId: data.id,
                    amount: data.amount,
                    status: 'FAILED',
                    reason: 'Insufficient funds or payment processing error'
                }
            });
        }
    } catch (e) {
        console.error("Error processing payment:", e);
        
        // Send payment failure event on exception
        Producer({
            topic: 'PAYMENT_FAILED_STATE',
            type: 'PAYMENT_FAILED_STATE',
            payload: {
                transactionId: data.transactionId,
                orderId: data.id,
                status: 'FAILED',
                reason: 'Payment processing exception'
            }
        });
    }
}