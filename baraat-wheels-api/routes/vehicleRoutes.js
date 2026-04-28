const express = require("express");
const multer = require("multer");
const vehicleController = require("../controllers/vehicleController");
const {
  protect,
  authorize,
  isAdmin,
  isApprovedClient,
  isApprovedPartner,
  selfOrAdmin,
} = require("../middleware/auth"); // your auth middleware

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
  protect, // 1. must be logged in
  authorize("partner"), // 2. must be role = "partner"
  isApprovedPartner, // 3. partner account must be admin-approved,
  uploadFields,
  vehicleController.addVehicle,
);
router.get("/my", protect, vehicleController.getMyVehicles);
router.put("/:id", protect, vehicleController.updateVehicle);
router.delete("/:id", protect, vehicleController.deleteVehicle);

// ── Public Routes ──────────────────────────────────────────────
router.get("/get-all", vehicleController.getAllVehicles);
router.get("/:id", vehicleController.getVehicleById);

// ── Admin Routes ───────────────────────────────────────────────
router.patch("/:id/review", protect, isAdmin, vehicleController.reviewVehicle);
router.patch(
  "/:id/verify-doc/:docType",
  protect,
  isAdmin,
  vehicleController.verifyDocument,
);

// ── Rating ─────────────────────────────────────────────────────
router.post("/:id/rating", protect, vehicleController.addRating);

module.exports = router;
