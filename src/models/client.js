const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    settings:[
        {
            description: String,
            amountInCents: Number
        }
    ]
});

module.exports = mongoose.model('Client', clientSchema);