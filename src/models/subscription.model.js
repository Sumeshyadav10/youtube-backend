const mongoose = require('mongoose');


const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Subscription', subscriptionSchema);