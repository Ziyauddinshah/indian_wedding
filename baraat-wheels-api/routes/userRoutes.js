const express = require("express");
const router = express.Router();

const {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
} = require("../middleware/auth");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  approveClient,
  deactivateUser,
} = require("../controllers/authController");

// ── Public routes ────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Private routes (all logged-in users) ─────────────────────
router.get("/me", authenticate, getMe);
router.put("/update-profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

// ── Admin only routes ─────────────────────────────────────────
router.put(
  "/admin/approve-client/:id",
  authenticate,
  authorize("admin"),
  approveClient,
);
router.delete(
  "/admin/deactivate/:id",
  authenticate,
  authorize("admin"),
  deactivateUser,
);

module.exports = router;
