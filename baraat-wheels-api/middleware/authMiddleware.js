const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

// Configuration - should be in environment variables
const JWT_CONFIG = {
  secretKey: process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex"),
  expiresIn: process.env.JWT_EXPIRES_IN || "10h",
  issuer: process.env.JWT_ISSUER || "your-app-name",
  audience: process.env.JWT_AUDIENCE || "your-app-client",
};

const generateJwtToken = (
  user_id,
  email,
  name,
  role_id,
  login_token_type,
  additionalClaims = {}
) => {
  // Validate required parameters
  if (!user_id || !email || !name || !login_token_type) {
    throw new Error("Missing required user information for token generation");
  }

  const user_data = {
    tokenName: "Jwt-Token",
    id: user_id,
    name: name,
    role_id: role_id,
    email: email.toLowerCase(),
    token_type: login_token_type,
    ...additionalClaims,
  };

  // Create token with enhanced options
  const token = jwt.sign(user_data, JWT_CONFIG.secretKey, {
    expiresIn: JWT_CONFIG.expiresIn,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
    algorithm: "HS256",
  });

  return token;
};

const verifyToken = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  // Check for token presence
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      status: false,
      error: "Access denied. No token provided",
      code: "MISSING_TOKEN",
    });
  }
  // Extract token from header
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      status: false,
      error: "Invalid token format. Use: Bearer <token>",
      code: "INVALID_TOKEN_FORMAT",
    });
  }

  const token = tokenParts[1];
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_CONFIG.secretKey, {
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
      algorithms: ["HS256"],
    });

    // Attach minimal necessary user information to request
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role_id: decoded.role_id,
    };

    // Add to response locals (if needed by other middleware)
    res.locals.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role_id: decoded.role_id,
    };

    // Proceed to next middleware
    return next();
  } catch (error) {
    // Enhanced error logging
    console.error(`JWT Error [${error.name}]:`, error.message);

    // Standardized error response
    const errorResponse = {
      success: false,
      status: false,
      error: "Authentication failed",
      code: "AUTH_ERROR",
    };

    // Specific error handling
    switch (error.name) {
      case "TokenExpiredError":
        errorResponse.error = "Token expired, please login again";
        errorResponse.code = "TOKEN_EXPIRED";
        errorResponse.expiredAt = error.expiredAt;
        break;

      case "JsonWebTokenError":
        errorResponse.error = "Invalid token";
        errorResponse.code = "INVALID_TOKEN";
        break;

      case "NotBeforeError":
        errorResponse.error = "Token not yet valid";
        errorResponse.code = "TOKEN_NOT_ACTIVE";
        errorResponse.date = error.date;
        break;
      default:
        break;
    }
    // Add debug info in development
    if (process.env.NODE_ENV === "development") {
      errorResponse.details = {
        message: error.message,
        stack: error.stack,
      };
    }

    return res.status(401).json(errorResponse);
  }
};

const decodeToken = (jwtToken) => {
  if (!jwtToken) {
    throw new Error("No token provided for decoding");
  }

  try {
    const decoded = jwt.decode(jwtToken, { complete: true });

    if (!decoded) {
      throw new Error("Invalid token format");
    }

    return {
      header: decoded.header,
      payload: decoded.payload,
      signature: decoded.signature,
    };
  } catch (error) {
    console.error("Token decoding failed:", error);
    throw new Error("Failed to decode token");
  }
};

// Additional utility functions
const generateRefreshToken = (user_id) => {
  return jwt.sign(
    { id: user_id, token_type: "refresh" },
    JWT_CONFIG.secretKey,
    { expiresIn: "7d" }
  );
};

const verifyRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_CONFIG.secretKey, (error, decoded) => {
      if (error) reject(error);
      else if (decoded.token_type !== "refresh") {
        reject(new Error("Invalid token type"));
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = {
  generateJwtToken,
  verifyToken,
  decodeToken,
  generateRefreshToken,
  verifyRefreshToken,
  JWT_CONFIG, // Export for testing purposes
};
