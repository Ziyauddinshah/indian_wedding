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
} = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  deactivateUser,
  approveCustomer,
} = require("../controllers/authController");

// ── Public routes ────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ── Private routes (all logged-in users) ─────────────────────
router.get("/verify-token", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid.",
  });
});
router.get("/me", authenticate, getMe);

router.put("/update-profile", authenticate, updateProfile);
router.put("/change-password", authenticate, changePassword);

// ── Admin only routes ─────────────────────────────────────────
router.put(
  "/admin/approve-customer/:id",
  authenticate,
  authorize("admin"),
  approveCustomer,
);
router.delete(
  "/admin/deactivate/:id",
  authenticate,
  authorize("admin"),
  deactivateUser,
);

module.exports = router;
