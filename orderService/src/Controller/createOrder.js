const uuidv1 = require('uuid/v1');

const OrderModel = require('../Model/orderModel');
const Producer = require('../../../kafkaBroker/kafkaHandler/routes');

const CreateOrder = async (req, res) => {
    try {
        const { name, itemCount, amount } = req.body;
        
        if (!name || !itemCount || !amount) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, itemCount, amount' 
            });
        }

        const transactionId = uuidv1();
        
        const order = new OrderModel({ 
            name,
            itemCount: Number(itemCount),
            amount: Number(amount),
            transactionId,
            status: 'PENDING' 
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: order._id,
                name: order.name,
                itemCount: order.itemCount,
                amount: order.amount,
                transactionId: order.transactionId,
                status: order.status
            }
        });

        // Publish order creation event
        Producer({
            topic: 'ORDER_CREATION_TRANSACTIONS',
            type: 'ORDER_CREATED',
            payload: {
                data: {
                    id: order._id,
                    transactionId: order.transactionId,
                    amount: order.amount,
                    itemCount: order.itemCount
                }
            }
        });

        console.log('Order created and event published:', order.transactionId);

    } catch (e) {
        console.error('Error creating order:', e);
        res.status(500).json({ 
            error: 'Internal server error',
            message: e.message 
        });
    }
}

module.exports = CreateOrder;