/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = 500;
  let message = "Internal server error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err.message) {
    message = err.message;

    // Check for specific error messages
    if (err.message.includes("not found")) {
      statusCode = 404;
    } else if (
      err.message.includes("already exists") ||
      err.message.includes("already registered") ||
      err.message.includes("already taken")
    ) {
      statusCode = 409;
    } else if (
      err.message.includes("Invalid") ||
      err.message.includes("required")
    ) {
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 handler
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
};

module.exports = {
  errorHandler,
  notFound,
};
