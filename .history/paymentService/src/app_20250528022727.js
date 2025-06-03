const Consumer = require('../../kafkaBroker/kafkaHandler/Consumer');
const eventHandler = require('./eventHandler');
try {

    const consumer = new Consumer();
      consumer.addTopics(["PAYMENT_SERVICE"]).then(() => {
        consumer.consume(message => {
            console.log("consumed message",message);
            try {
                const parsedMessage = JSON.parse(message.value);
                eventHandler(parsedMessage);
            } catch (error) {
                console.error('Error parsing message:', error);
                console.log('Raw message:', message);
            }
        })
    }).catch(error => {
        console.error('Error setting up Kafka consumer:', error);
    });
    
    console.log("Payment service Started Successfully");
    
    }
    catch(e){
        console.log(`Orchestrator Error ${e}`);
    }