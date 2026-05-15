const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    phone: { type: String, default: '' },
    password: { type: String, required: true },
    profilepic: { type: String, default: '' },
    role: { type: String, enum: ['tourist', 'admin'], default: 'tourist' },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('UsersTbl', UserSchema, 'UsersTbl');
module.exports = UserModel;
