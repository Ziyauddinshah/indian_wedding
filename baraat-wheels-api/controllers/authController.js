const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
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
} = require("../middleware/authMiddleware");

const bcrypt = require("bcryptjs");

// ── Helper: send token response ──────────────────────────────
const sendTokenResponse = (req, res, user, statusCode, rememberMe = false) => {
  const accessToken = generateAccessToken(user);
  const refreshData = generateRefreshToken(rememberMe);

  // Ensure refreshTokens array exists
  if (!user.refreshTokens) {
    user.refreshTokens = [];
  }

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

// ────────────────────────────────────────────────────────────
// @route   POST /api/users/register
// @access  Public
// ────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      confirmPassword,
      role,
      address,
      referralCode,
    } = req.body;

    // ── 1. Required field validation ─────────────────────────────────
    if (!name || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, phone, email, and password.",
      });
    }

    // ── 2. Password confirmation check ─────────────────────────────
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // ── 3. Password strength validation ────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // ── 4. Role validation & normalization ─────────────────────────
    const validRoles = ["customer", "partner"];
    let userRole = (role || "customer").toLowerCase().trim();

    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "customer", or "partner".',
      });
    }

    // ── 5. Prevent direct admin registration ─────────────────────
    if (userRole === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created via public registration.",
      });
    }

    // ── 6. Admin code check (if somehow admin role passed) ─────────
    if (userRole === "admin" && process.env.ADMIN_SECRET_CODE) {
      if (adminCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin authorization code.",
        });
      }
    }

    // ── 7. Check existing user (email or phone) ────────────────────
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase() ? "email" : "phone";
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists.`,
        field,
      });
    }

    // ── 8. Build role-specific profile ─────────────────────────────
    const userData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      isActive: true,
      isVerified: false, // Require email verification
      createdAt: new Date(),
      lastLoginIp: req.ip,
      device: req.headers["user-agent"] || "unknown",
    };

    // Customer profile
    if (userRole === "customer") {
      userData.customerProfile = {
        totalBookings: 0,
        loyaltyPoints: 0,
        favoriteVehicles: [],
        addresses: address ? [address] : [],
        referralCode: referralCode || null,
      };
    }

    // Partner profile
    if (userRole === "partner") {
      // Validate partner-specific fields
      // if (!businessName) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Business name is required for partner registration.",
      //   });
      // }

      userData.partnerProfile = {
        businessName: "",
        gstNumber: "",
        panNumber: "",
        isApproved: false, // Requires admin approval
        commissionRate: 15,
        totalVehicles: 0,
        totalEarnings: 0,
        rating: 0,
        documents: [],
        verifiedAt: null,
      };
    }

    // ── 9. Create user (password hashed via pre-save hook) ──────────
    const user = await User.create(userData);

    // ── 10. Generate tokens ────────────────────────────────────────
    const accessToken = generateAccessToken(user);
    const refreshData = generateRefreshToken(false); // No remember me on register

    const hashedRefresh = hashToken(refreshData.token);

    user.refreshTokens = [
      {
        token: hashedRefresh,
        createdAt: new Date(),
        expiresAt: refreshData.expiresAt,
        device: req.headers["user-agent"] || "unknown",
        ip: req.ip,
        rememberMe: false,
      },
    ];

    await user.save();

    // ── 11. Set cookies ──────────────────────────────────────────
    setTokenCookies(res, accessToken, refreshData.token, false);

    // ── 12. Send verification email (async, don't block) ───────
    // sendVerificationEmail(user.email, user.name).catch(console.error);

    // ── 13. Build response ───────────────────────────────────────
    const userResponse = buildUserResponse(user);

    // ── 14. Return success ─────────────────────────────────────────
    const message =
      userRole === "partner"
        ? "Registration successful. Your partner account is pending admin approval. You will be notified once approved."
        : "Registration successful. Please verify your email to activate your account.";

    console.log(userResponse);
    res.status(201).json({
      success: true,
      message,
      token: accessToken,
      user: userResponse,
      requiresVerification: true,
      requiresApproval: userRole === "partner",
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists.`,
        field,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

// ────────────────────────────────────────────────────────────
// @route   POST /api/users/login
// @access  Public
// ────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password, role, rememberMe, adminCode } = req.body;

    // ── 1. Basic field validation ──────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const expectedUserRole = role;
    if (!expectedUserRole) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type selected.",
      });
    }

    // ── 2. Find user (include role + profiles for checks) ──────────
    const user = await User.findOne({
      email: email,
      role: expectedUserRole,
    }).select({
      password: 1,
      isActive: 1,
      role: 1,
      customerProfile: 1,
      partnerProfile: 1,
      name: 1,
      email: 1,
      phone: 1,
      isVerified: 1,
      loginAttempts: 1,
      lockUntil: 1,
      refreshTokens: 1,
      lastLogin: 1,
    });

    // ── 3. Generic error for wrong email OR wrong password ─────────
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── 4. Check account lockout ───────────────────────────────────
    if (isAccountLocked(user)) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Account locked. Try again in ${remainingMinutes} minutes.`,
        code: "ACCOUNT_LOCKED",
      });
    }

    // ── 5. Verify password (with login attempt tracking) ──────────
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

    // ── 6. Role mismatch — right password, wrong tab ───────────────
    if (user.role !== expectedUserRole) {
      const correctTab = USER_ROLES[user.role] || user.role;
      return res.status(403).json({
        success: false,
        message: `This account is registered as "${correctTab}". Please select the "${correctTab}" tab and try again.`,
      });
    }

    // ── 7. Deactivated account ─────────────────────────────────────
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // ── 8. Admin login — check adminCode ──────────────────────────
    if (user.role === "admin") {
      const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE;
      if (ADMIN_SECRET && adminCode !== ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code.",
        });
      }
    }

    // ── 9. Reset login attempts on success ────────────────────────
    resetLoginAttempts(user);

    // ── 10. Update last login info ────────────────────────────────
    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    // ── 11. Partner pending approval — allow login but warn ───────
    const isPendingPartner =
      user.role === "partner" && !user.partnerProfile?.isApproved;

    if (isPendingPartner) {
      const accessToken = generateAccessToken(user);
      const refreshData = generateRefreshToken(false); // No remember me for pending

      const hashedRefresh = hashToken(refreshData.token);

      // Clean old refresh tokens
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }

      user.refreshTokens.push({
        token: hashedRefresh,
        createdAt: new Date(),
        expiresAt: refreshData.expiresAt,
        device: req.headers["user-agent"] || "unknown",
        ip: req.ip,
        rememberMe: false,
      });
      await user.save();

      setTokenCookies(res, accessToken, refreshData.token, false);

      // Build user response
      const userPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isApproved: false,
        verificationStatus: user.isVerified ? "approved" : "pending",
      };

      return res.status(200).json({
        success: true,
        message:
          "Login successful. Your partner account is pending admin approval.",
        token: accessToken,
        user: userPayload,
        isApproved: false,
        pendingApproval: true,
      });
    }

    // ── 12. Standard successful login ─────────────────────────────
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
    await user.save();

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
};

// ============================================
// REFRESH TOKEN
// ============================================
const refreshToken = async (req, res) => {
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
};

// ============================================
// LOGOUT (Current Device)
// ============================================
const logout = async (req, res) => {
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
};

// ============================================
// LOGOUT ALL DEVICES
// ============================================
const logoutAll = async (req, res) => {
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
};

// ────────────────────────────────────────────────────────────
// @route   GET /api/users/me
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
// ============================================
// GET CURRENT USER
// ============================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/update-profile
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
// ============================================
// UPDATE PROFILE
// ============================================
const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "address", "profileImage"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/change-password
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
// ============================================
// CHANGE PASSWORD (Logged-in user)
// ============================================

const changePassword = async (req, res) => {
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

    const user = await User.findById(req.user._id).select("+password");

    user.password = newPassword;
    await user.save();

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

    sendTokenResponse(user, 200, res);

    // res.status(200).json({
    //   success: true,
    //   message:
    //     "Password changed successfully. Please log in again with your new password.",
    // });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Password change failed.",
    });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/admin/approve-client/:id
// @access  Private (admin only)
// ────────────────────────────────────────────────────────────
const approveClient = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "client",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    client.clientProfile.isApproved = true;
    client.clientProfile.approvedAt = new Date();
    client.clientProfile.approvedBy = req.user._id;
    await client.save();

    res.status(200).json({
      success: true,
      message: `Client ${client.name} has been approved.`,
      user: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// FORGOT PASSWORD - Step 1: Request Reset
// ============================================
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address.",
      });
    }

    const user = await User.findOne({ email });

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
};

// ============================================
// VERIFY RESET TOKEN
// ============================================
const verifyResetToken = async (req, res) => {
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
};

// ============================================
// RESET PASSWORD - Step 2: Set New Password
// ============================================
const resetPassword = async (req, res) => {
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
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    const tokenData = db.resetTokens.get(hashedToken);

    if (!user && !tokenData) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired reset token. Please request a new password reset.",
      });
    }

    const targetUser = user || (await User.findById(tokenData?.userId));

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
};

// ============================================
// GET ACTIVE SESSIONS
// ============================================
const getActiveSessions = async (req, res) => {
  const user = await User.findById(req.user._id);

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
};

// ============================================
// ADMIN ROUTES
// ============================================

// Approve Partner
const approvePartner = async (req, res) => {
  try {
    const partner = await User.findById(req.params.id);

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
};

// Approve Customer
const approveCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);

    if (!customer || customer.role !== "customer") {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.customerProfile.isApproved = true;
    customer.customerProfile.approvedAt = new Date();
    customer.customerProfile.approvedBy = req.user.id;

    res.status(200).json({
      success: true,
      message: `Customer ${customer.name} has been approved.`,
      user: buildUserResponse(customer),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Approval failed.",
    });
  }
};

// ────────────────────────────────────────────────────────────
// @route   DELETE /api/users/admin/deactivate/:id
// @access  Private (admin only)
// ────────────────────────────────────────────────────────────
// Deactivate User
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
      (authorize("admin"),
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
        });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Deactivation failed.",
    });
  }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { role, isApproved } = req.query;
    let users = await User.find({}).select("-password -refreshTokens");

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (isApproved !== undefined && role === "partner") {
      users = users.filter((u) => async () => {
        if (u.role !== "partner") return false;
        const partner = await User.findById(u.id);
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
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getActiveSessions,
  approvePartner,
  approveCustomer,
  deactivateUser,
  getAllUsers,
};
