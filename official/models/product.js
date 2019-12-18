const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productSchema = new mongoose.Schema({
    name: String,
    type: String,
    price: Number,
    descrition: String,
    quantity: Number,
    image: String
}, { collection: 'san_pham' });

module.exports = mongoose.model('san_pham', productSchema);