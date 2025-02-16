const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});

//crating a model from the schema
module.exports = mongoose.model('User', userShema);