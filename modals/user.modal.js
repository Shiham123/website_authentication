const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  dateNow: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', userSchema);
