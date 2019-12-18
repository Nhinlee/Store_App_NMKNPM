const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
}, { collection: 'nguoi_dung' });


module.exports = mongoose.model('nguoi_dung', userSchema);