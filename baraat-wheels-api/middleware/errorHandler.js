// middleware/errorHandler.js
const { ApplicationError } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.details && { details: err.details }),
      code: err.code || "application_error",
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    code: "internal_server_error",
  });
};
