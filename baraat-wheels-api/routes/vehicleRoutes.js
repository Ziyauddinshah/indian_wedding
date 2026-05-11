const express = require("express");
const multer = require("multer");
const vehicleController = require("../controllers/vehicleController");
const {
  authenticate,
  optionalAuth,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
} = require("../middleware/authMiddleware"); // your auth middleware

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed"));
    }
  },
});

const uploadFields = upload.fields([
  { name: "rc", maxCount: 1 },
  { name: "puc", maxCount: 1 },
  { name: "insurance", maxCount: 1 },
  { name: "vehicleImages", maxCount: 10 },
]);

router.get("/owner-stats", vehicleController.getOwnerVehicleStats);

// ── Partner Routes ─────────────────────────────────────────────
router.post(
  "/add",
  authenticate, // 1. must be logged in
  authorize("partner"), // 2. must be role = "partner"
  isApprovedPartner, // 3. partner account must be admin-approved,
  uploadFields,
  vehicleController.addVehicle,
);
router.get("/my", authenticate, vehicleController.getMyVehicles);
router.put("/:id", authenticate, vehicleController.updateVehicle);
router.delete("/:id", authenticate, vehicleController.deleteVehicle);

// ── Public Routes ──────────────────────────────────────────────
router.get("/get-all", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getVehicleById);

// ── Admin Routes ───────────────────────────────────────────────
router.patch(
  "/:id/review",
  authenticate,
  isAdmin,
  vehicleController.reviewVehicle,
);
router.patch(
  "/:id/verify-doc/:docType",
  authenticate,
  isAdmin,
  vehicleController.verifyDocument,
);

// ── Rating ─────────────────────────────────────────────────────
router.post("/:id/rating", authenticate, vehicleController.addRating);

module.exports = router;
