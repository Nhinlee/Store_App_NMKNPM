const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    gender: Number,
    dob: String,
    address: String
}, { collection: 'customer' });

module.exports = mongoose.model('customer', productSchema);