const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncCatch = require("../middleware/asyncCatch");

exports.getAllUsers = asyncCatch(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, users, count: users.length });
});

exports.getSingleUser = asyncCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) throw new ErrorResponse("User not found", 404);

  res.status(200).json({ success: true, user });
});
