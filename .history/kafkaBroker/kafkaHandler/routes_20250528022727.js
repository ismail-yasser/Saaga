const Producer = require('./Producer');

const producer = new Producer();

const messageTypeToTopicMessaging = {
    ORDER_CREATION_TRANSACTIONS : ["ORCHESTATOR_SERVICE"],
    PAYMENT_FAILED_STATE : ["ORCHESTATOR_SERVICE"],
    ORDER_PREPARED : ["ORCHESTATOR_SERVICE"],
    OUT_OF_STOCK_ORDER : ["ORCHESTATOR_SERVICE"],
    PAYMENT_COMPLETED_STATE : ["ORCHESTATOR_SERVICE"],
    EXECUTE_PAYMENT : ["PAYMENT_SERVICE"],
    PREPARE_ORDER : ["STOCK_SERVICE"],
    ORDER_PAYMENT_COMPLETED : ["ORDER_SERVICE"],
    ORDER_PAYMENT_FAILED : ["ORDER_SERVICE"]
}

module.exports = (payload) => {
    console.log("Routing payload:", payload);
    
    const topics = messageTypeToTopicMessaging[payload.topic];
    if (topics) {
        topics.forEach(topic => {
            console.log(`Sending message to topic: ${topic}`);
            producer.produce(topic, JSON.stringify(payload));
        });
    } else {
        console.warn(`No routing found for topic: ${payload.topic}`);
    }
}