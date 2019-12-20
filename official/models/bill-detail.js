const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productSchema = new mongoose.Schema({
    billId: String,
    productId: String,
    productName: String,
    quantity: Number,
    productPrice: Number
}, { collection: 'bill-detail' });

module.exports = mongoose.model('bill-detail', productSchema);