const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  let message = err.message || "Server error";

  if (err.name === "CastError") {
    message = `Resource with the given id ${err.value} does not exist`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    message = "Duplicate field value entered";
    err = new ErrorResponse(message, 400);
  }

  if (err.code === "ENOTFOUND") {
    message = "Cloud Storage error, Please check your internet connection";
    err = new ErrorResponse(message, 500);
  }

  res.status(error.statusCode || 500).json({ success: false, message });
};

module.exports = errorHandler;
