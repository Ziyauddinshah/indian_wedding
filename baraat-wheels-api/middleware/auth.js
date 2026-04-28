const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Verify JWT token ──────────────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Bearer token from header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. Fallback: cookie
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // 3. Verify token — distinguish expired vs invalid
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // 4. Find user — never expose password hash on req.user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact support.",
      });
    }

    // 5. Reject token if password was changed after it was issued
    if (user.passwordChangedAt) {
      const changedAt = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedAt) {
        return res.status(401).json({
          success: false,
          message: "Password was recently changed. Please login again.",
        });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error. Please try again.",
    });
  }
};

// ── Role-based access control ─────────────────────────────────────────────────
// Usage: authorize("admin") or authorize("admin", "partner")
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Only ${roles.join(", ")} can perform this action.`,
      });
    }
    next();
  };
};

// ── Admin check ───────────────────────────────────────────────────────────────
exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }
  next();
};

// ── Approved client check ─────────────────────────────────────────────────────
exports.isApprovedClient = (req, res, next) => {
  if (req.user.role === "client" && !req.user.clientProfile?.isApproved) {
    return res.status(403).json({
      success: false,
      message: "Your client account is pending admin approval.",
    });
  }
  next();
};

// ── Approved partner check ────────────────────────────────────────────────────
exports.isApprovedPartner = (req, res, next) => {
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
exports.selfOrAdmin = (req, res, next) => {
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
