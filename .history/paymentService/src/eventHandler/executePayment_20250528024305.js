const Producer = require('../../../kafkaBroker/kafkaHandler/routes');

module.exports = (message) => {
    console.log("Processing payment for message:", message);
    
    try {
        // Extract data from the message payload structure
        const data = message.payload?.data || message;
        const transactionId = data.transactionId;
        const orderId = data.id;
        const amount = data.amount;
        
        console.log(`Extracted data - Transaction: ${transactionId}, Order: ${orderId}, Amount: ${amount}`);
        
        // Simulate payment processing logic
        const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo
          if (paymentSuccess) {
            console.log("✅ Payment successful for transaction:", transactionId);
            
            // Send payment success event to orchestrator
            Producer({
                topic: 'ORCHESTATOR_SERVICE',
                type: 'PAYMENT_COMPLETED_STATE',
                payload: {
                    transactionId: transactionId,
                    orderId: orderId,
                    amount: amount,
                    status: 'SUCCESS'
                }
            });
        } else {
            console.log("❌ Payment failed for transaction:", transactionId);
            
            // Send payment failure event to orchestrator
            Producer({
                topic: 'ORCHESTATOR_SERVICE',
                type: 'PAYMENT_FAILED_STATE',
                payload: {
                    transactionId: transactionId,
                    orderId: orderId,
                    amount: amount,
                    status: 'FAILED',
                    reason: 'Insufficient funds or payment processing error'
                }
            });
        }} catch (e) {
        console.error("Error processing payment:", e);
        
        // Send payment failure event on exception
        Producer({
            topic: 'PAYMENT_FAILED_STATE',
            type: 'PAYMENT_FAILED_STATE',
            payload: {
                transactionId: data?.transactionId || 'unknown',
                orderId: data?.id || 'unknown',
                status: 'FAILED',
                reason: 'Payment processing exception'
            }
        });
    }
}