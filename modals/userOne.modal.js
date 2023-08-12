const mongoose = require('mongoose');
const mongooseEncryption = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const secret = process.env.encrypt_key;
userSchema.plugin(mongooseEncryption, {
  secret: secret,
  encryptedFields: ['password'],
});

module.exports = mongoose.model('userOne', userSchema);
