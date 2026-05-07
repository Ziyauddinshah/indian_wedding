const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const router = express.Router();
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generatePasswordResetToken,
  isAccountLocked,
  incrementLoginAttempts,
  resetLoginAttempts,
  isTokenIssuedBeforePasswordChange,
  setTokenCookies,
} = require("../utils/authUtils");
const db = require("../data/dummyDB");
const {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
} = require("../middleware/auth");

// ─────────────────────────────────────────────────────────────
// HELPER: Build user response (removes sensitive fields)
// ─────────────────────────────────────────────────────────────

const buildUserResponse = (user, includeProfiles = true) => {
  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
  };

  if (includeProfiles) {
    if (user.role === "partner" && user.partnerProfile) {
      response.partnerProfile = user.partnerProfile;
    }
    if (user.role === "customer" && user.customerProfile) {
      response.customerProfile = user.customerProfile;
    }
    if (user.role === "admin" && user.adminProfile) {
      response.adminProfile = user.adminProfile;
    }
  }

  return response;
};

const sendTokenResponse = (res, user, statusCode, rememberMe = false) => {
  const accessToken = generateAccessToken(user);
  const refreshData = generateRefreshToken(rememberMe);

  // Store hashed refresh token
  const hashedRefresh = hashToken(refreshData.token);
  user.refreshTokens.push({
    token: hashedRefresh,
    createdAt: new Date(),
    expiresAt: refreshData.expiresAt,
    device: req.headers["user-agent"] || "unknown",
    ip: req.ip,
    rememberMe: rememberMe,
  });

  // Clean old tokens (keep max 5)
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  setTokenCookies(res, accessToken, refreshData.token, rememberMe);

  return res.status(statusCode).json({
    success: true,
    token: accessToken,
    user: buildUserResponse(user),
  });
};

// ─────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────

// ============================================
// REGISTER
// ============================================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role,
      businessName,
      gstNumber,
      panNumber,
    } = req.body;

    // Validation
    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, phone, email, and password.",
      });
    }

    // Prevent admin registration via API
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created via registration.",
      });
    }

    // Validate role
    const validRoles = ["customer", "partner"];
    const userRole = role || "customer";
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "customer" or "partner".',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Check existing user
    const existingEmail = db.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const existingPhone = db.findUserByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "User with this phone already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Build user data with role-specific profile
    const userData = {
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      isActive: true,
      isVerified: true,
    };

    if (userRole === "partner") {
      userData.partnerProfile = {
        businessName: businessName || "",
        gstNumber: gstNumber || "",
        panNumber: panNumber || "",
        isApproved: false, // Partners need admin approval
        commissionRate: 15,
        totalVehicles: 0,
        totalEarnings: 0,
        rating: 0,
        documents: [],
      };
    }

    if (userRole === "customer") {
      userData.customerProfile = {
        totalBookings: 0,
        loyaltyPoints: 0,
        favoriteVehicles: [],
        addresses: [],
      };
    }

    const user = db.createUser(userData);

    // Generate tokens (no remember me on register)
    const accessToken = generateAccessToken(user);
    const refreshData = generateRefreshToken(false);
    const hashedRefresh = hashToken(refreshData.token);

    user.refreshTokens.push({
      token: hashedRefresh,
      createdAt: new Date(),
      expiresAt: refreshData.expiresAt,
      device: req.headers["user-agent"] || "unknown",
      ip: req.ip,
      rememberMe: false,
    });

    setTokenCookies(res, accessToken, refreshData.token, false);

    res.status(201).json({
      success: true,
      message:
        userRole === "partner"
          ? "Registration successful. Your partner account is pending admin approval."
          : "Registration successful.",
      token: accessToken,
      user: buildUserResponse(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
});

// ============================================
// LOGIN (with Remember Me & Role Validation)
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { email, password, userType, rememberMe, adminCode } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // Map frontend userType to DB role
    const FRONTEND_TO_DB_ROLE = {
      customer: "customer",
      partner: "partner",
      admin: "admin",
    };

    const expectedRole = FRONTEND_TO_DB_ROLE[userType];
    if (!expectedRole) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type selected.",
      });
    }

    // Find user
    const user = db.findUserByEmail(email);

    // Generic error for wrong email OR wrong password (security)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check account lockout
    if (isAccountLocked(user)) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${remainingMinutes} minutes.`,
        code: "ACCOUNT_LOCKED",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      incrementLoginAttempts(user);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - user.loginAttempts;

      return res.status(401).json({
        success: false,
        message:
          remainingAttempts > 0
            ? `Invalid credentials. ${remainingAttempts} attempts remaining.`
            : "Account locked for 2 hours due to too many failed attempts.",
        remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0,
      });
    }

    // Role mismatch - right password, wrong portal/tab
    if (user.role !== expectedRole) {
      const correctTab = FRONTEND_TO_DB_ROLE[user.role] || user.role;
      return res.status(403).json({
        success: false,
        message: `This account is registered as "${correctTab}". Please select the "${correctTab}" tab and try again.`,
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // Admin-specific validation
    if (user.role === "admin") {
      const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE;
      if (ADMIN_SECRET && adminCode !== ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code.",
        });
      }
    }

    // Reset login attempts on success
    resetLoginAttempts(user);

    // Update last login
    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;

    // Check partner approval status
    const isPendingPartner =
      user.role === "partner" && !user.partnerProfile?.isApproved;

    if (isPendingPartner) {
      // Allow login but flag as pending
      const accessToken = generateAccessToken(user);
      const refreshData = generateRefreshToken(false); // No remember me for pending

      const hashedRefresh = hashToken(refreshData.token);
      user.refreshTokens.push({
        token: hashedRefresh,
        createdAt: new Date(),
        expiresAt: refreshData.expiresAt,
        device: req.headers["user-agent"] || "unknown",
        ip: req.ip,
        rememberMe: false,
      });

      setTokenCookies(res, accessToken, refreshData.token, false);

      return res.status(200).json({
        success: true,
        message:
          "Login successful. Your partner account is pending admin approval.",
        token: accessToken,
        user: buildUserResponse(user),
        isApproved: false,
        pendingApproval: true,
      });
    }

    // Standard successful login
    // Clean old refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    const accessToken = generateAccessToken(user);
    const refreshData = generateRefreshToken(rememberMe === true);

    const hashedRefresh = hashToken(refreshData.token);
    user.refreshTokens.push({
      token: hashedRefresh,
      createdAt: new Date(),
      expiresAt: refreshData.expiresAt,
      device: req.headers["user-agent"] || "unknown",
      ip: req.ip,
      rememberMe: rememberMe === true,
    });

    setTokenCookies(res, accessToken, refreshData.token, rememberMe === true);

    res.status(200).json({
      success: true,
      message: rememberMe
        ? "Login successful. You will stay logged in for 30 days."
        : "Login successful.",
      token: accessToken,
      user: buildUserResponse(user),
      rememberMe: rememberMe === true,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again.",
    });
  }
});

// ============================================
// REFRESH TOKEN
// ============================================
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required.",
        code: "NO_REFRESH_TOKEN",
      });
    }

    const hashedProvided = hashToken(refreshToken);

    // Find user with this refresh token
    const user = db.users.find((u) =>
      u.refreshTokens.some((rt) => rt.token === hashedProvided),
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token.",
        code: "INVALID_REFRESH_TOKEN",
      });
    }

    const tokenRecord = user.refreshTokens.find(
      (rt) => rt.token === hashedProvided,
    );

    // Check expiry
    if (tokenRecord.expiresAt < new Date()) {
      user.refreshTokens = user.refreshTokens.filter(
        (rt) => rt.token !== hashedProvided,
      );
      clearTokenCookies(res);

      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
        code: "REFRESH_TOKEN_EXPIRED",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account deactivated.",
      });
    }

    // Rotate token (remove old, create new)
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== hashedProvided,
    );

    const newAccessToken = generateAccessToken(user);
    const newRefreshData = generateRefreshToken(
      tokenRecord.rememberMe || false,
    );

    const newHashedRefresh = hashToken(newRefreshData.token);
    user.refreshTokens.push({
      token: newHashedRefresh,
      createdAt: new Date(),
      expiresAt: newRefreshData.expiresAt,
      device: req.headers["user-agent"] || "unknown",
      ip: req.ip,
      rememberMe: tokenRecord.rememberMe || false,
    });

    setTokenCookies(
      res,
      newAccessToken,
      newRefreshData.token,
      tokenRecord.rememberMe || false,
    );

    res.status(200).json({
      success: true,
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Token refresh failed.",
    });
  }
});

// ============================================
// LOGOUT (Current Device)
// ============================================
router.post("/logout", authenticate, async (req, res) => {
  try {
    const user = db.findUserById(req.user.id);

    if (user) {
      const currentRefreshToken = req.cookies?.refreshToken;
      if (currentRefreshToken) {
        const hashedToken = hashToken(currentRefreshToken);
        user.refreshTokens = user.refreshTokens.filter(
          (rt) => rt.token !== hashedToken,
        );
      }
    }

    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
});

// ============================================
// LOGOUT ALL DEVICES
// ============================================
router.post("/logout-all", authenticate, async (req, res) => {
  try {
    const user = db.findUserById(req.user.id);
    if (user) {
      user.refreshTokens = [];
    }

    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
});

// ============================================
// GET CURRENT USER
// ============================================
router.get("/me", authenticate, (req, res) => {
  const user = db.findUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    user: buildUserResponse(user),
  });
});

// ============================================
// UPDATE PROFILE
// ============================================
router.put("/update-profile", authenticate, async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "email", "address", "profileImage"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    Object.assign(user, updates);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Profile update failed.",
    });
  }
});

// ============================================
// CHANGE PASSWORD (Logged-in user)
// ============================================
router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    const user = db.findUserById(req.user.id);

    const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();

    // Clear all refresh tokens (force re-login everywhere)
    user.refreshTokens = [];
    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please log in again with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Password change failed.",
    });
  }
});

// ============================================
// FORGOT PASSWORD - Step 1: Request Reset
// ============================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address.",
      });
    }

    const user = db.findUserByEmail(email);

    // Always return generic success (prevent email enumeration)
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    if (isAccountLocked(user)) {
      return res.status(423).json({
        success: false,
        message: "Account temporarily locked. Please try again later.",
      });
    }

    // Generate reset token
    const resetData = generatePasswordResetToken();

    user.passwordResetToken = resetData.hashed;
    user.passwordResetExpires = resetData.expiresAt;

    db.resetTokens.set(resetData.hashed, {
      userId: user.id,
      expiresAt: resetData.expiresAt,
    });

    // TODO: Send email with nodemailer
    console.log("=================================");
    console.log("PASSWORD RESET TOKEN (send via email):");
    console.log(
      `Reset URL: http://localhost:3000/reset-password?token=${resetData.raw}`,
    );
    console.log(`Token expires at: ${resetData.expiresAt}`);
    console.log("=================================");

    res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent.",
      devToken:
        process.env.NODE_ENV !== "production" ? resetData.raw : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request.",
    });
  }
});

// ============================================
// VERIFY RESET TOKEN
// ============================================
router.get("/verify-reset-token", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token required.",
      });
    }

    const hashedToken = hashToken(token);
    const tokenData = db.resetTokens.get(hashedToken);

    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
        valid: false,
      });
    }

    if (tokenData.expiresAt < new Date()) {
      db.resetTokens.delete(hashedToken);

      const user = db.findUserById(tokenData.userId);
      if (user) {
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
      }

      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
        valid: false,
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      expiresAt: tokenData.expiresAt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token verification failed.",
    });
  }
});

// ============================================
// RESET PASSWORD - Step 2: Set New Password
// ============================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide reset token and new password.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const hashedToken = hashToken(token);

    // Find user by reset token and check expiry
    const user = db.users.find(
      (u) =>
        u.passwordResetToken === hashedToken &&
        u.passwordResetExpires > new Date(),
    );

    const tokenData = db.resetTokens.get(hashedToken);

    if (!user && !tokenData) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    const targetUser = user || db.findUserById(tokenData?.userId);

    if (!targetUser || targetUser.passwordResetExpires < new Date()) {
      if (targetUser) {
        targetUser.passwordResetToken = null;
        targetUser.passwordResetExpires = null;
      }
      db.resetTokens.delete(hashedToken);

      return res.status(400).json({
        success: false,
        message: "Reset token has expired. Please request a new one.",
      });
    }

    // Check if new password same as old
    const isSamePassword = await bcrypt.compare(
      newPassword,
      targetUser.password,
    );
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from your current password.",
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    targetUser.password = hashedPassword;
    targetUser.passwordChangedAt = new Date();
    targetUser.passwordResetToken = null;
    targetUser.passwordResetExpires = null;

    // Clear all sessions for security
    targetUser.refreshTokens = [];
    db.resetTokens.delete(hashedToken);
    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please log in with your new password. You have been logged out from all devices for security.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed. Please try again.",
    });
  }
});

// ============================================
// GET ACTIVE SESSIONS
// ============================================
router.get("/sessions", authenticate, (req, res) => {
  const user = db.findUserById(req.user.id);

  const sessions = user.refreshTokens.map((rt, index) => ({
    id: index,
    device: rt.device,
    ip: rt.ip,
    createdAt: rt.createdAt,
    expiresAt: rt.expiresAt,
    rememberMe: rt.rememberMe || false,
  }));

  res.status(200).json({
    success: true,
    sessions,
    totalSessions: sessions.length,
  });
});

// ============================================
// ADMIN ROUTES
// ============================================

// Approve Partner
router.patch(
  "/admin/approve-partner/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const partner = db.findUserById(req.params.id);

      if (!partner || partner.role !== "partner") {
        return res.status(404).json({
          success: false,
          message: "Partner not found.",
        });
      }

      partner.partnerProfile.isApproved = true;
      partner.partnerProfile.approvedAt = new Date();
      partner.partnerProfile.approvedBy = req.user.id;

      res.status(200).json({
        success: true,
        message: `Partner ${partner.name} has been approved.`,
        user: buildUserResponse(partner),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Approval failed.",
      });
    }
  },
);

// Deactivate User
router.patch(
  "/admin/deactivate/:id",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const user = db.findUserById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Prevent self-deactivation
      if (user.id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot deactivate your own account.",
        });
      }

      user.isActive = false;
      user.refreshTokens = []; // Force logout

      res.status(200).json({
        success: true,
        message: `User ${user.name} has been deactivated.`,
        user: buildUserResponse(user),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Deactivation failed.",
      });
    }
  },
);

// Get All Users (Admin)
router.get("/admin/users", authenticate, authorize("admin"), (req, res) => {
  try {
    const { role, isApproved } = req.query;
    let users = db.users.map((u) => buildUserResponse(u));

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (isApproved !== undefined && role === "partner") {
      users = users.filter((u) => {
        if (u.role !== "partner") return false;
        const partner = db.findUserById(u.id);
        return partner.partnerProfile?.isApproved === (isApproved === "true");
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Export router for use in other files
module.exports = router;
