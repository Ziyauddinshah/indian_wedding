// Error handling function
const {
  ApplicationError,
  AuthenticationError,
  AccountLockedError,
  ValidationError,
  NotFoundError,
  DuplicateDataError,
  DatabaseError,
  NotificationError,
  BusinessLogicError,
  ConflictError,
  UnauthorizedError,
  PaymentValidationError,
  PaymentProcessingError,
  PaymentGatewayError,
  PaymentError,
  TransactionError,
  InventoryError,
} = require("../utils/errors");

const errorHandler = (error, res, handlerName) => {
  console.error(`Error in ${handlerName} controller:`, error);

  // Handle specific error types
  if (error instanceof ApplicationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof AuthenticationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof AccountLockedError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof DuplicateDataError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof DatabaseError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof NotificationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof BusinessLogicError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof ConflictError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof UnauthorizedError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof PaymentValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof PaymentProcessingError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof PaymentGatewayError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof PaymentError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof TransactionError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else if (error instanceof InventoryError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      type: error.name,
    });
  } else {
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

module.exports = errorHandler;
