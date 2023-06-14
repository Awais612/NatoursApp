const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/*schema for the user
 *name, email, photo, passwords, passwordConfirm
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter your valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'You must have to setup the password for the account.'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        // This only works only for the CREATE & SAVE!!!!
        return el === this.password; // abc === abc it'll give the boolean value either true or false.
      },
      message: 'Passwords are not the same!',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Password encryption with the hash cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
