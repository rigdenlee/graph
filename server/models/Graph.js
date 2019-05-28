const mongoose = require('mongoose');

const GraphSchema = new mongoose.Schema({
    productname: {
        type: String
    },
    numberofbugs: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Graph = mongoose.model('graph', GraphSchema);