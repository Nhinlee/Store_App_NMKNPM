const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productTypeSchema = new mongoose.Schema({
    name: String
}, { collection: 'product-type' });

module.exports = mongoose.model('product-type', productTypeSchema);