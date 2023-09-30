const jwt = require("jsonwebtoken");
const asyncCatch = require("./asyncCatch");
const User = require("../models/User.model");
const ErrorResponse = require("../utils/errorResponse");

exports.protect = asyncCatch(async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) throw new ErrorResponse("Not authorized to access this route", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new ErrorResponse("Not authorized to access this route", 403);
    next();
  };
};
