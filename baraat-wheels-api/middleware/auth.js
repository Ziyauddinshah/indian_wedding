// middleware/auth1.js
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  isTokenIssuedBeforePasswordChange,
} = require("../utils/authUtils");
const db = require("../data/dummyDB");
const User = require("../models/User");

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
    const user = db.findUserById(decoded.userId);
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
      const user = db.findUserById(decoded.userId);

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
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
};
