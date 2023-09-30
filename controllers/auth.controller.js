const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncCatch = require("../middleware/asyncCatch");

/**
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncCatch(async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  let user = new User({ first_name, last_name, email, password });
  await user.save();

  sendTokenResponse(user, 201, res);
});

/**
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid credentials", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ErrorResponse("Invalid credentials", 401);

  sendTokenResponse(user, 200, res);
});

/**
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.currentUser = asyncCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, user });
});

/**
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncCatch(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ErrorResponse("There is no user with this email", 404);

  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

/**
 * @route   POST /api/v1/auth/resetpassword/:resetpasswordtoken
 * @access  Public
 */
exports.restPassword = asyncCatch(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ErrorResponse("There is no user with this email", 404);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

/**
 * @route   PUT /api/v1/auth/updatepassword
 * @access  Private
 */
exports.updatepassword = asyncCatch(async (req, res) => {
  const { current_password, new_password } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(current_password);
  if (!isMatch) throw new ErrorResponse("Invalid password", 401);

  user.password = new_password;
  await user.save();

  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAccessToken();
  res.status(statusCode).json({ success: true, token });
};
