// utils/authUtils.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────
const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m"; // Short-lived access token
const JWT_ISSUER = process.env.JWT_ISSUER || "your-app-name";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "your-app-client";
const JWT_REFRESH_EXPIRY_SHORT = process.env.JWT_REFRESH_EXPIRY_SHORT || "7d"; // Normal refresh token
const JWT_REFRESH_EXPIRY_LONG = process.env.JWT_REFRESH_EXPIRY_LONG || "30d"; // Remember Me refresh token
const RESET_TOKEN_EXPIRY = process.env.RESET_TOKEN_EXPIRY || 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_LOGIN_ATTEMPTS = process.env.MAX_LOGIN_ATTEMPTS || 5;
const LOCK_TIME = process.env.LOCK_TIME || 2 * 60 * 60 * 1000; // 2 hours lockout
const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;

/**
 * Generate Access Token (short-lived, contains user info)
 */
const generateAccessToken = (user) => {
  const response = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRY,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithm: "HS256",
    },
  );
  return response;
};

const verifyAccessToken = (req, res, next) => {
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
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
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

const decodeAccessToken = (jwtToken) => {
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

/**
 * Generate Refresh Token (long-lived, random string stored in DB)
 * @param {boolean} rememberMe - If true, token lasts 30 days, else 7 days
 */
const generateRefreshToken = (rememberMe = false) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresIn = rememberMe
    ? JWT_REFRESH_EXPIRY_LONG
    : JWT_REFRESH_EXPIRY_SHORT;
  const days = rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return { token, expiresAt, expiresIn };
};

const verifyRefreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) reject(error);
      else if (decoded.token_type !== "refresh") {
        reject(new Error("Invalid token type"));
      } else {
        resolve(decoded);
      }
    });
  });
};

/**
 * Hash token for storage (prevents DB theft from being usable)
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate Password Reset Token
 * Returns raw token (sent to user) and stores hashed version
 */
const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  return { raw: rawToken, hashed: hashedToken, expiresAt };
};

/**
 * Check if account is locked due to failed attempts
 */
const isAccountLocked = (user) => {
  if (!user.lockUntil) return false;
  return user.lockUntil > Date.now();
};

/**
 * Increment login attempts, lock if exceeded
 */
const incrementLoginAttempts = (user) => {
  if (user.lockUntil && user.lockUntil < Date.now()) {
    user.loginAttempts = 0;
    user.lockUntil = null;
  }
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.lockUntil = Date.now() + LOCK_TIME;
  }
  return user;
};

/**
 * Reset login attempts on successful login
 */
const resetLoginAttempts = (user) => {
  user.loginAttempts = 0;
  user.lockUntil = null;
  return user;
};

/**
 * Verify if JWT was issued before password change
 */
const isTokenIssuedBeforePasswordChange = (jwtTimestamp, passwordChangedAt) => {
  if (!passwordChangedAt) return false;
  const changedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
  return jwtTimestamp < changedTimestamp;
};

/**
 * Set token cookies
 */
const setTokenCookies = (
  res,
  accessToken,
  refreshToken,
  rememberMe = false,
) => {
  // Access token - short lived
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token - longer lived
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/api/auth/refresh",
  });
};

/**
 * Clear token cookies
 */
const clearTokenCookies = (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/api/auth/refresh",
    sameSite: "strict",
  });
};

/**
 * Main Authentication Middleware
 * Verifies access token from Authorization header or cookie
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from header or cookie
    let token;

    // Check Authorization header first
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // Fallback to cookie
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    // 4. Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated.",
      });
    }

    // 5. Check if password was changed after token was issued
    if (
      isTokenIssuedBeforePasswordChange(decoded.iat, user.passwordChangedAt)
    ) {
      return res.status(401).json({
        success: false,
        message: "Password recently changed. Please log in again.",
      });
    }

    // 6. Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please refresh your session.",
        code: "TOKEN_EXPIRED",
      });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
};

/**
 * Optional Authentication - doesn't fail if no token
 * Used for routes that work for both guests and logged-in users
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        };
      }
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
};

/**
 * Role-based Authorization Middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// ── Admin check ───────────────────────────────────────────────────────────────
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};

// ── Approved client check ─────────────────────────────────────────────────────
const isApprovedClient = (req, res, next) => {
  if (req.user.role === "client" && !req.user.clientProfile?.isApproved) {
    return res.status(403).json({
      success: false,
      message: "Your client account is pending admin approval.",
    });
  }
  next();
};

// ── Approved partner check ────────────────────────────────────────────────────
const isApprovedPartner = (req, res, next) => {
  if (req.user.role === "partner" && !req.user.partnerProfile?.isApproved) {
    return res.status(403).json({
      success: false,
      message: "Your partner account is pending admin approval.",
    });
  }
  next();
};

// ── Self or Admin check ───────────────────────────────────────────────────────
// Lets a user access their own resource OR admin access any resource
const selfOrAdmin = (req, res, next) => {
  const isAdmin = req.user?.role === "admin";
  const isSelf = req.user?._id.toString() === req.params.id;

  if (!isAdmin && !isSelf) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only access your own data.",
    });
  }
  next();
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  decodeAccessToken,
  verifyRefreshToken,
  generateRefreshToken,
  hashToken,
  generatePasswordResetToken,
  isAccountLocked,
  incrementLoginAttempts,
  resetLoginAttempts,
  isTokenIssuedBeforePasswordChange,
  setTokenCookies,
  clearTokenCookies,
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
  MAX_LOGIN_ATTEMPTS,
};
