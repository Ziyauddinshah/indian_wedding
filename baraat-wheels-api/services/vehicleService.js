const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");

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
    ownerId: ownerId,

    // Basic Info
    vehicleType: body.vehicleType,
    company: body.company,
    vehicleName: body.vehicleName,
    modelYear: parseInt(body.modelYear) || new Date().getFullYear(),
    seatingCapacity: parseInt(body.seatingCapacity) || 5,
    color: body.color || "Not specified",
    features: body.features ? JSON.parse(body.features) : [], // array from form-data
    description: body.description,

    // Pricing
    basePricePerHour: parseFloat(body.basePricePerHour),
    basePricePerDay: body.basePricePerDay
      ? parseFloat(body.basePricePerDay)
      : null,
    extraKmRate: body.extraKmRate || "150",
    extraHourRate: body.extraHourRate || "1500",
    gstPercent: body.gstPercent ? parseFloat(body.gstPercent) : 18,

    // Location
    location: {
      city: body.city || "Lucknow",
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

  return await Vehicle.find(query).sort({ createdAt: -1 }).populate("ownerId"); // adjust fields as needed
}

async function getVehicleById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("Invalid ID format");
    err.statusCode = 400;
    throw err;
  }

  const vehicle = await Vehicle.findById(id).populate(
    "ownerId",
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
  return await Vehicle.find({ ownerId: ownerId }).sort({ createdAt: -1 });
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

async function getVehiclesWithStats(filters = {}, options = {}) {
  try {
    // 1. Get all vehicles with stats
    const vehicles = await Vehicle.findWithStats(filters, options);
    return vehicles;
  } catch (error) {
    console.error("Error finding vehicles with stats:", error);
    throw new Error("Internal server error");
  }
}

async function findActiveSortedVehicles(filters = {}, options = {}) {
  try {
    // 2. Active vehicles only, sorted by rating
    const active = await Vehicle.findWithStats(
      { is_active: true },
      { sortBy: "stats.rating", order: "desc" },
    );
    return active;
  } catch (error) {
    console.error("Error finding vehicles with stats:", error);
    throw new Error("Internal server error");
  }
}

async function findVehiclesByLocation(filters = {}, options = {}) {
  try {
    // 3. Filter by location with pagination
    // 3. Filter by location with pagination
    const mumbai = await Vehicle.findWithStats(
      { location: "Mumbai", vehicle_type: "bike" },
      { skip: 0, limit: 20, sortBy: "stats.total_bookings", order: "desc" },
    );
    return mumbai;
  } catch (error) {
    console.error("Error finding vehicles with stats:", error);
    throw new Error("Internal server error");
  }
}

async function getVehicleWithVehicleId(filters = {}, options = {}) {
  try {
    // 4. Get single vehicle by ID
    const single = await Vehicle.findWithStats({
      _id: new mongoose.Types.ObjectId("507f1f77bcf86cd799439011"),
    });
    return single;
  } catch (error) {
    console.error("Error finding vehicles with stats:", error);
    throw new Error("Internal server error");
  }
}

async function getVehicleWithoutStats(filters = {}, options = {}) {
  try {
    // 5. Vehicles with no stats (null check)
    const noStats = await Vehicle.findWithStats({
      stats: { $eq: null },
    });
    return noStats;
  } catch (error) {
    console.error("Error finding vehicles with stats:", error);
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

// Booking Stats Retrieval
async function getBookingStats(bookingId) {
  return await Booking.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "partnerId",
        foreignField: "_id",
        as: "partner",
      },
    },
    {
      $lookup: {
        from: "vehicles",
        localField: "vehicleId",
        foreignField: "_id",
        as: "vehicleData",
      },
    },
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "payment",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$partner",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$vehicleData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$payment",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        // Booking fields
        _id: 1,
        status: 1,
        pickupOtp: 1,
        dropOtp: 1,
        pickup: 1,
        drop: 1,
        timeline: 1,
        fare: 1,
        paymentStatus: 1,
        tracking: 1,
        cancelledBy: 1,
        cancellationReason: 1,
        cancellationFee: 1,
        isReviewedByUser: 1,
        isReviewedByPartner: 1,

        // User (Customer) fields
        customer: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          phone: "$user.phone",
          avatar: "$user.avatar",
          rating: "$user.rating",
          createdAt: "$user.createdAt",
          isActive: "$user.isActive",
        },

        // Partner (Driver) fields
        driver: {
          _id: "$partner._id",
          name: "$partner.name",
          email: "$partner.email",
          phone: "$partner.phone",
          avatar: "$partner.avatar",
          rating: "$partner.rating",
          vehicleNumber: "$partner.vehicleNumber",
          licenseNumber: "$partner.licenseNumber",
          isAvailable: "$partner.isAvailable",
          createdAt: "$partner.createdAt",
        },

        // Vehicle fields - Updated to match actual vehicle schema
        vehicle: {
          _id: "$vehicleData._id",
          company: "$vehicleData.company",
          vehicleName: "$vehicleData.vehicleName",
          modelYear: "$vehicleData.modelYear",
          vehicleType: "$vehicleData.vehicleType",
          category: "$vehicleData.category",
          rcNumber: "$vehicleData.rcNumber",
          basePricePerHour: "$vehicleData.basePricePerHour",
          extraHourRate: "$vehicleData.extraHourRate",
          extraKmRate: "$vehicleData.extraKmRate",
          currency: "$vehicleData.currency",
          location: "$vehicleData.location",
          description: "$vehicleData.description",
          images: "$vehicleData.images",
        },

        // Payment fields
        payment: {
          _id: "$payment._id",
          amount: "$payment.amount",
          status: "$payment.status",
          method: "$payment.method",
          transactionId: "$payment.transactionId",
          gateway: "$payment.gateway",
          paidAt: "$payment.paidAt",
          refundedAt: "$payment.refundedAt",
          gatewayResponse: "$payment.gatewayResponse",
        },
      },
    },
    {
      $sort: { "timeline.createdAt": -1 },
    },
  ]);
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
  getVehiclesWithStats,
  getBookingStats,
};
