const mongoose = require("mongoose");
const vehicleService = require("../services/vehicleService");
const { Vehicle } = require("../models/Vehicle");
const REQUIRED_FIELDS = [
  "vehicleType",
  "company",
  "vehicleName",
  "modelYear",
  "seatingCapacity",
  "basePricePerHour",
  "rcNumber",
  "pucNumber",
  "insuranceNumber",
  "city",
  "description",
];

// ── Create ────────────────────────────────────────────────────────────────────

async function addVehicle(req, res) {
  try {
    const { body, files } = req;
    const ownerId = req.user._id; // from auth middleware

    // ── Safety net (middleware already blocks, but double check) ──
    if (req.user.role !== "partner") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only partners can register vehicles.",
      });
    }

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!body[field]) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate required document files
    if (
      !files?.["rc"]?.[0] ||
      !files?.["puc"]?.[0] ||
      !files?.["insurance"]?.[0]
    ) {
      return res
        .status(400)
        .json({ error: "RC, PUC, and Insurance documents are required" });
    }

    if (!files?.["vehicleImages"] || files["vehicleImages"].length === 0) {
      return res
        .status(400)
        .json({ error: "At least one vehicle image is required" });
    }

    const vehicle = await vehicleService.registerVehicle(body, files, ownerId);

    return res.status(201).json({
      message: "Vehicle registered successfully! Pending admin approval.",
      vehicleId: vehicle._id,
      vehicle,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────

async function getAllVehicles(req, res) {
  try {
    // ?city=Lucknow&vehicleType=SUV&status=approved&isAvailable=true
    const vehicles = await vehicleService.getAllVehicles(req.query);
    return res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getVehicleById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("Invalid ID format");
      err.statusCode = 400;
      throw err;
    }
    console.log("Service received ID:", id, "Type:", typeof id);
    const vehicle = await vehicleService.getVehicleById(id);
    return res.json(vehicle);
  } catch (error) {
    return handleError(res, error);
  }
}

async function getMyVehicles(req, res) {
  try {
    const vehicles = await vehicleService.getVehiclesByOwner(req.user._id);
    return res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getOwnerVehicleStats(req, res) {
  try {
    const vehicles = await vehicleService.getOwnerVehicleStats();
    return res.status(200).json({ count: vehicles.length, vehicles });
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

async function updateVehicle(req, res) {
  try {
    const vehicle = await vehicleService.updateVehicle(
      req.params.id,
      req.body,
      req.user._id,
    );
    return res.json({ message: "Vehicle updated successfully", vehicle });
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function reviewVehicle(req, res) {
  try {
    const { status, rejectionReason } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const vehicle = await vehicleService.reviewVehicle(
      req.params.id,
      status,
      req.user._id,
      rejectionReason,
    );

    return res.json({ message: `Vehicle ${status} successfully`, vehicle });
  } catch (error) {
    return handleError(res, error);
  }
}

async function verifyDocument(req, res) {
  try {
    const { docType } = req.params; // rc | puc | insurance
    const vehicle = await vehicleService.verifyDocument(req.params.id, docType);
    return res.json({
      message: `${docType.toUpperCase()} verified successfully`,
      vehicle,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function deleteVehicle(req, res) {
  try {
    const result = await vehicleService.deleteVehicle(
      req.params.id,
      req.user._id,
    );
    return res.json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Rating ────────────────────────────────────────────────────────────────────

async function addRating(req, res) {
  try {
    const { rating } = req.body;
    if (!rating) return res.status(400).json({ error: "Rating is required" });

    const vehicle = await vehicleService.addRating(
      req.params.id,
      parseFloat(rating),
    );
    return res.json({ message: "Rating submitted", stats: vehicle.stats });
  } catch (error) {
    return handleError(res, error);
  }
}

// ── Error Handler ─────────────────────────────────────────────────────────────

function handleError(res, error) {
  console.error(error);

  if (error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ error: "Validation failed", details: messages });
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res
      .status(409)
      .json({ error: `Duplicate value: ${field} already exists` });
  }

  const status = error.statusCode || 500;
  return res
    .status(status)
    .json({ error: error.message || "Internal server error" });
}

module.exports = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  reviewVehicle,
  verifyDocument,
  deleteVehicle,
  addRating,
  getOwnerVehicleStats,
};
