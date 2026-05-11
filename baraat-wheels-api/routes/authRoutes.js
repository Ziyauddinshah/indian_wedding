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
  MAX_LOGIN_ATTEMPTS,
} = require("../middleware/authMiddleware");

const {
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
} = require("../controllers/authController");

const {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
} = require("../middleware/authMiddleware");

// ============================================
// REGISTER
// ============================================
router.post("/register", register); // Use controller function directly

// ============================================
// LOGIN (with Remember Me & Role Validation)
// ============================================
router.post("/login", login); // Use controller function directly

// ============================================
// REFRESH TOKEN
// ============================================
router.post("/refresh", refreshToken);

// ============================================
// LOGOUT (Current Device)
// ============================================
router.post("/logout", authenticate, logout); // Use controller function directly

// ============================================
// LOGOUT ALL DEVICES
// ============================================
router.post("/logout-all", authenticate, logoutAll); // Use controller function directly

// ============================================
// GET CURRENT USER
// ============================================
router.get("/me", authenticate, getMe); // Use controller function directly

// ============================================
// UPDATE PROFILE
// ============================================
router.put("/update-profile", authenticate, updateProfile); // Use controller function directly

// ============================================
// CHANGE PASSWORD (Logged-in user)
// ============================================
router.post("/change-password", authenticate, changePassword); // Use controller function directly

// ============================================
// FORGOT PASSWORD - Step 1: Request Reset
// ============================================
router.post("/forgot-password", forgotPassword); // Use controller function directly

// ============================================
// VERIFY RESET TOKEN
// ============================================
router.get("/verify-reset-token", verifyResetToken); // Use controller function directly

// ============================================
// RESET PASSWORD - Step 2: Set New Password
// ============================================
router.post("/reset-password", resetPassword); // Use controller function directly

// ============================================
// GET ACTIVE SESSIONS
// ============================================
router.get("/sessions", authenticate, getActiveSessions); // Use controller function directly

// ============================================
// ADMIN ROUTES
// ============================================

// Approve Partner
router.patch(
  "/admin/approve-partner/:id",
  authenticate,
  authorize("admin"),
  approvePartner,
);

// Deactivate User
router.patch(
  "/admin/deactivate/:id",
  authenticate,
  authorize("admin"),
  deactivateUser,
);

// Get All Users (Admin)
router.get("/admin/users", authenticate, authorize("admin"), getAllUsers); // Use controller function directly

// Export router for use in other files
module.exports = router;
