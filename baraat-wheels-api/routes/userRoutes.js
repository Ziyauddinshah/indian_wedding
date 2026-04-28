const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  approveClient,
  deactivateUser,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/auth");

// ── Public routes ────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Private routes (all logged-in users) ─────────────────────
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// ── Admin only routes ─────────────────────────────────────────
router.put(
  "/admin/approve-client/:id",
  protect,
  authorize("admin"),
  approveClient,
);
router.delete(
  "/admin/deactivate/:id",
  protect,
  authorize("admin"),
  deactivateUser,
);

module.exports = router;
