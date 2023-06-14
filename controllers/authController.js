const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

  // Creating the jwt

  const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);


  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if the email and password exists.
  if (!email || !password) {
    return next(new AppError('Please provide a valid email and password', 400));
  }

  // 2) check if the user exist and the password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Email or password', 401));
  }

  // 3) if everything is ok, send the token to the client.

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
