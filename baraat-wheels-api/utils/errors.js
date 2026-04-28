// utils/errors.js
class ApplicationError extends Error {
  constructor(message, statusCode, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message = "Authentication failed", details) {
    super(message, 401, details);
    this.name = "AuthenticationError";
  }
}

class AccountLockedError extends ApplicationError {
  constructor(message = "Account temporarily locked", retryAfter, details) {
    super(message, 429, { ...details, retryAfter });
    this.name = "AccountLockedError";
  }
}

class ValidationError extends ApplicationError {
  constructor(message = "Validation failed", details) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

class NotFoundError extends ApplicationError {
  constructor(message = "Data not found", details) {
    super(message, 404, details);
    this.name = "NotFoundError";
  }
}

class DuplicateDataError extends ApplicationError {
  constructor(message = "Duplicate data found", details) {
    super(message, 409, details);
    this.name = "DuplicateDataError";
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, details) {
    super(message, 404, details);
    this.name = "DatabaseError";
  }
}

class NotificationError extends ApplicationError {
  constructor(message, details) {
    super(message, 500, details);
    this.name = "NotificationError";
  }
}

class BusinessLogicError extends ApplicationError {
  constructor(message, details) {
    super(message, 422, details);
    this.name = "BusinessLogicError";
  }
}

class ConflictError extends ApplicationError {
  constructor(message, details) {
    super(message, 409, details);
    this.name = "ConflictError";
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message = "You are not Authorized", details) {
    super(message, 403, details);
    this.name = "UnauthorizedError";
  }
}

class PaymentError extends Error {
  constructor(message, statusCode, paymentId = null, details = {}) {
    super(message);
    this.paymentId = paymentId;
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class PaymentValidationError extends PaymentError {
  constructor(message, details) {
    super(message, details);
    this.name = "PaymentValidationError";
  }
}

class PaymentProcessingError extends PaymentError {
  constructor(message, details, paymentId = null) {
    super(message, details, paymentId);
    this.name = "PaymentProcessingError";
  }
}

class PaymentGatewayError extends PaymentError {
  constructor(message, details, gatewayCode = null) {
    super(message, details);
    this.name = "PaymentGatewayError";
    this.gatewayCode = gatewayCode;
  }
}

class TransactionError extends Error {
  constructor(message) {
    super(message);
    this.name = "TransactionError";
  }
}

class InventoryError extends Error {
  constructor(message, productId = null) {
    super(message);
    this.name = "InventoryError";
    this.productId = productId;
  }
}

module.exports = {
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
};
