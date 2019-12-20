const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productSchema = new mongoose.Schema({
    customerId: String,
    createOn: String,
    totalPrice: Number
}, { collection: 'bill' });

module.exports = mongoose.model('bill', productSchema);