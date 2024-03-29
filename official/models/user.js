const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    fullname: String,
    email: String,
    phone: String,
    gender: String,
    dob: String,
    address: String
}, { collection: 'user' });


module.exports = mongoose.model('user', userSchema);