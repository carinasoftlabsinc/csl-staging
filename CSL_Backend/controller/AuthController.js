const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/admin.model');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);


  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    expiresIn: 86400,
    data: user,
  });
};

// ---- Admin accounts, managed by a SuperAdmin (routes use protect + restrictTo('SuperAdmin')) ----

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  active: user.active !== false,
  createdAt: user.createdAt,
});

// Creates a new account with role Admin. A SuperAdmin can only be made by scripts/create-super-admin.js.
exports.createAdminUser = catchAsync(async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  // The email field has no unique index; check the collection directly so deactivated accounts count too.
  if (email && (await User.collection.findOne({ email }))) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const newUser = await User.create({
    name: req.body.name,
    email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: 'Admin',
  });

  res.status(201).json({ status: 'success', data: publicUser(newUser) });
});

exports.listUsers = catchAsync(async (req, res, next) => {
  // Collection query so deactivated accounts are listed too; never select the password.
  const users = await User.collection
    .find({}, { projection: { name: 1, email: 1, role: 1, active: 1, createdAt: 1 } })
    .sort({ createdAt: 1 })
    .toArray();

  res.status(200).json({ status: 'success', results: users.length, data: users.map(publicUser) });
});

exports.deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No active account found with that ID.', 404));
  }
  if (String(user._id) === String(req.user._id)) {
    return next(new AppError('You cannot deactivate your own account.', 400));
  }
  if (user.role === 'SuperAdmin') {
    // countDocuments does not run the model's find hook, so filter out deactivated accounts here.
    const activeSuperAdmins = await User.countDocuments({ role: 'SuperAdmin', active: { $ne: false } });
    if (activeSuperAdmins <= 1) {
      return next(new AppError('You cannot deactivate the last SuperAdmin.', 400));
    }
  }

  await User.updateOne({ _id: user._id }, { active: false });

  res.status(200).json({ status: 'success', data: publicUser({ ...user.toObject(), active: false }) });
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  // res.cookie('jwt', 'loggedout', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true
  // });
  // res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});
