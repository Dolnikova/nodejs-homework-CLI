const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/[a-z0-9]+@[a-z0-9]+/, 'user email is not valid!'], // simple check
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'password should be at least 6 characters long'],
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    avatarURL: { type: String, required: true },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },

  {
    timestamps: true, // adds createdAt and updatedAt fields
    versionKey: false,
  }
);

const User = mongoose.model('user', userSchema);

module.exports = { User };
