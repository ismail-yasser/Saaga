const Mongoose = require('mongoose');

const orderSchema = new Mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    transactionId : {
        type : String,
        required : true
    },
    status: {
        type: String,
        required : true
    },
    itemCount : {
        type : Number,
        required : true
    },
    amount: {
        type: Number,
        required: false
    },
    failureReason: {
        type: String,
        required: false
    }
},{ timestamps : true})

module.exports = Mongoose.model('Order',orderSchema)