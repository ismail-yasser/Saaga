const Consumer = require('../../kafkaBroker/kafkaHandler/Consumer');
const Transactions = require('./Transactions');
try {

const consumer = new Consumer();

consumer.addTopics(["ORCHESTATOR_SERVICE", "ORDER_CREATION_TRANSACTIONS"]).then(() => {
    consumer.consume(message => {
        console.log("consumed message",message);
        try {
            const parsedMessage = JSON.parse(message.value);
            Transactions(parsedMessage);
        } catch (error) {
            console.error('Error parsing message:', error);
            console.log('Raw message:', message);
        }
    })
}).catch(error => {
    console.error('Error setting up Kafka consumer:', error);
})

console.log("Orchestator Started successfully");

}
catch(e){
    console.log(`Orchestrator Error ${e}`);
}