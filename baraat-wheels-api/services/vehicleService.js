const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");

// ── File Helpers ──────────────────────────────────────────────────────────────

async function ensureUploadDirs() {
  const dirs = [
    path.join(__dirname, "../public/uploads/documents"),
    path.join(__dirname, "../public/uploads/vehicles"),
  ];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function saveFile(file, subDir) {
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const filepath = path.join(__dirname, "../public/uploads", subDir, filename);
  await fs.writeFile(filepath, file.buffer);
  return `/uploads/${subDir}/${filename}`;
}

// ── Create ────────────────────────────────────────────────────────────────────

async function registerVehicle(body, files, ownerId) {
  await ensureUploadDirs();

  // Save documents
  const [rcUrl, pucUrl, insuranceUrl] = await Promise.all([
    saveFile(files["rc"][0], "documents"),
    saveFile(files["puc"][0], "documents"),
    saveFile(files["insurance"][0], "documents"),
  ]);

  // Save vehicle images
  const imagePaths = await Promise.all(
    files["vehicleImages"].map((file) => saveFile(file, "vehicles")),
  );

  const vehicle = new Vehicle({
    owner_id: ownerId,

    // Basic Info
    vehicleType: body.vehicleType,
    company: body.company,
    vehicleName: body.vehicleName,
    modelYear: parseInt(body.modelYear),
    seatingCapacity: parseInt(body.seatingCapacity),
    color: body.color || null,
    features: body.features ? JSON.parse(body.features) : [], // array from form-data
    description: body.description,

    // Pricing
    basePricePerHour: parseFloat(body.basePricePerHour),
    basePricePerDay: body.basePricePerDay
      ? parseFloat(body.basePricePerDay)
      : null,
    extra_km_rate: body.extra_km_rate || "150",
    extra_hour_rate: body.extra_hour_rate || "1500",
    gstPercent: body.gstPercent ? parseFloat(body.gstPercent) : 18,

    // Location
    location: {
      city: body.city,
      state: body.state || "Uttar Pradesh",
      pincode: body.pincode || null,
    },

    // Documents (urls only — verified stays false until admin approves)
    rcNumber: body.rcNumber,
    pucNumber: body.pucNumber,
    pucExpiry: body.pucExpiry || null,
    insuranceNumber: body.insuranceNumber,
    insuranceExpiry: body.insuranceExpiry || null,
    documents: {
      rc: { url: rcUrl, verified: false },
      puc: { url: pucUrl, verified: false },
      insurance: { url: insuranceUrl, verified: false },
    },

    // Images (thumbnail auto-set by pre-save hook)
    images: imagePaths,
  });

  await vehicle.save();
  return vehicle;
}

// ── Read ──────────────────────────────────────────────────────────────────────

async function getAllVehicles(filters = {}) {
  const query = {};

  if (filters.city) query["location.city"] = new RegExp(filters.city, "i");
  if (filters.vehicleType) query.vehicleType = filters.vehicleType;
  if (filters.status) query.status = filters.status;
  if (filters.isAvailable) query.isAvailable = filters.isAvailable === "true";

  return await Vehicle.find(query).sort({ createdAt: -1 }).populate("owner_id"); // adjust fields as needed
}

async function getVehicleById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid ID format");
    err.statusCode = 400;
    throw err;
  }

  const vehicle = await Vehicle.findById(id).populate(
    "owner_id",
    "name email phone",
  );

  if (!vehicle) {
    const err = new Error("Vehicle not found");
    err.statusCode = 404;
    throw err;
  }

  return vehicle;
}

async function getVehiclesByOwner(ownerId) {
  return await Vehicle.find({ owner_id: ownerId }).sort({ createdAt: -1 });
}

async function getOwnerVehicleStats() {
  try {
    const results = await Vehicle.aggregate([
      {
        // Stage 1: Lookup vehicle stats from vehicle_stats collection
        $lookup: {
          from: "vehicle_stats", // name of the stats collection
          localField: "_id",
          foreignField: "vehicle_id",
          as: "stats",
        },
      },
      {
        // Stage 2: Unwind stats (preserve vehicles without stats)
        $unwind: {
          path: "$stats",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Stage 3: Group by owner_id to aggregate stats and collect vehicles
        $group: {
          _id: "$owner_id",
          totalVehicles: { $sum: 1 },
          totalBookings: { $sum: { $ifNull: ["$stats.totalBookings", 0] } },
          avgRating: { $avg: { $ifNull: ["$stats.rating", 0] } },
          lastBooking: { $max: "$stats.lastBooking" }, // latest booking date across vehicles
          vehicles: {
            $push: {
              vehicleId: "$_id",
              vehicleName: "$vehicleName",
              company: "$company",
              basePricePerHour: "$basePricePerHour",
              images: "$images",
              modelYear: "$modelYear",
              location: "$location",
              isActive: "$is_active",
              status: "$status",
              stats: {
                totalBookings: { $ifNull: ["$stats.totalBookings", 0] },
                rating: { $ifNull: ["$stats.rating", 0] },
                lastBooking: "$stats.lastBooking",
                statusDisplay: "$stats.status_display",
              },
            },
          },
        },
      },
      {
        // Stage 4: Lookup owner details from users collection
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        // Stage 5: Unwind ownerDetails (there should be exactly one)
        $unwind: {
          path: "$ownerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        // Stage 6: Project final shape
        $project: {
          ownerId: "$_id",
          ownerName: "$ownerDetails.name",
          ownerEmail: "$ownerDetails.email",
          ownerPhone: "$ownerDetails.phone", // adjust based on your User schema
          totalVehicles: 1,
          totalBookings: 1,
          avgRating: { $round: ["$avgRating", 2] },
          lastBooking: 1,
          vehicles: 1,
        },
      },
      {
        // Optional: sort by owner name or totalVehicles
        $sort: { totalVehicles: -1 },
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error fetching owner stats:", error);
    throw new Error("Internal server error");
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

async function updateVehicle(id, body, ownerId) {
  const vehicle = await getVehicleById(id);

  // Ownership check
  if (vehicle.owner_id.toString() !== ownerId.toString()) {
    const err = new Error("Unauthorized: You do not own this vehicle");
    err.statusCode = 403;
    throw err;
  }

  const allowedUpdates = [
    "vehicleType",
    "company",
    "vehicleName",
    "modelYear",
    "seatingCapacity",
    "color",
    "features",
    "description",
    "basePricePerHour",
    "basePricePerDay",
    "extra_km_rate",
    "extra_hour_rate",
    "gstPercent",
    "pucExpiry",
    "insuranceExpiry",
    "isAvailable",
    "unavailableDates",
  ];

  allowedUpdates.forEach((field) => {
    if (body[field] !== undefined) {
      vehicle[field] = body[field];
    }
  });

  // Update nested location if provided
  if (body.city !== undefined) vehicle.location.city = body.city;
  if (body.state !== undefined) vehicle.location.state = body.state;
  if (body.pincode !== undefined) vehicle.location.pincode = body.pincode;

  vehicle.updatedAt = new Date();
  await vehicle.save();
  return vehicle;
}

// ── Admin: Review ─────────────────────────────────────────────────────────────

async function reviewVehicle(id, status, adminId, rejectionReason = null) {
  const vehicle = await getVehicleById(id);

  if (!["approved", "rejected"].includes(status)) {
    const err = new Error("Status must be 'approved' or 'rejected'");
    err.statusCode = 400;
    throw err;
  }

  vehicle.status = status;
  vehicle.reviewedBy = adminId;
  vehicle.reviewedAt = new Date();
  vehicle.rejectionReason = status === "rejected" ? rejectionReason : null;

  await vehicle.save();
  return vehicle;
}

async function verifyDocument(id, docType) {
  if (!["rc", "puc", "insurance"].includes(docType)) {
    const err = new Error("Invalid document type");
    err.statusCode = 400;
    throw err;
  }

  const vehicle = await getVehicleById(id);
  vehicle.documents[docType].verified = true;
  await vehicle.save();
  return vehicle;
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function deleteVehicle(id, ownerId) {
  const vehicle = await getVehicleById(id);

  if (vehicle.owner_id.toString() !== ownerId.toString()) {
    const err = new Error("Unauthorized: You do not own this vehicle");
    err.statusCode = 403;
    throw err;
  }

  await Vehicle.findByIdAndDelete(id);
  return { message: "Vehicle deleted successfully" };
}

// ── Rating ────────────────────────────────────────────────────────────────────

async function addRating(id, rating) {
  if (rating < 1 || rating > 5) {
    const err = new Error("Rating must be between 1 and 5");
    err.statusCode = 400;
    throw err;
  }

  const vehicle = await getVehicleById(id);
  await vehicle.updateRating(rating); // uses the model method
  return vehicle;
}

module.exports = {
  registerVehicle,
  getAllVehicles,
  getVehicleById,
  getVehiclesByOwner,
  updateVehicle,
  reviewVehicle,
  verifyDocument,
  deleteVehicle,
  addRating,
  getOwnerVehicleStats,
};
