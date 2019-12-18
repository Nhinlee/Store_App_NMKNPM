const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const productTypeSchema = new mongoose.Schema({
    name: String
}, { collection: 'loai_san_pham' });

module.exports = mongoose.model('loai_san_pham', productTypeSchema);