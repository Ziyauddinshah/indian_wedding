// models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    basePricePerHour: { type: Number, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    documents: {
      insurance: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
      rc: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
      puc: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
    },

    location: {
      city: { type: [String], default: [] },
      state: { type: String, default: null },
      pincode: { type: String, default: null },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // ← fixes "status is required"
    },

    isActive: {
      type: Boolean,
      default: true, // ← fixes "isActive is required"
    },
    extraHourRate: { type: String, required: true },
    extraKmRate: { type: String, required: true },
    images: [{ type: String }],
    insuranceNumber: { type: String, required: true },
    modelYear: { type: Number, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pucNumber: { type: String, required: true },
    rcNumber: { type: String, required: true },
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, required: true },
    category: { type: String },
    currency: { type: String },
    seatingCapacity: { type: Number },
    color: { type: String },
    features: [{ type: String }],
    gstPercent: { type: Number, default: 18 },
    thumbnail: { type: String },
    stats: {
      rating: { type: Number, default: 0 },
      statusDisplay: { type: String },
      lastBooking: { type: Date },
      totalBookings: { type: Number, default: 0 },
      vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
      },
    },
  },
  { timestamps: true },
);

// Static method for join query
vehicleSchema.statics.findWithStats = function (filters = {}, options = {}) {
  const pipeline = [
    { $match: filters },
    {
      $lookup: {
        from: "vehicle_stats", // Collection: vehicle_stats
        localField: "_id",
        foreignField: "vehicleId",
        as: "stats",
      },
    },
    {
      $unwind: {
        path: "$stats",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // Sorting
  if (options.sortBy) {
    pipeline.push({
      $sort: { [options.sortBy]: options.order === "asc" ? 1 : -1 },
    });
  }

  // Pagination
  if (options.skip) pipeline.push({ $skip: options.skip });
  if (options.limit) pipeline.push({ $limit: options.limit });

  return this.aggregate(pipeline);
};

// module.exports = mongoose.model('Vehicle', vehicleSchema, 'vehicles');  // Collection: vehicles

vehicleSchema.index({ ownerId: 1 });
vehicleSchema.index({ status: 1, isActive: 1 });
vehicleSchema.index({ "location.city": 1, vehicleType: 1 });
vehicleSchema.index({ basePricePerHour: 1 });
vehicleSchema.index({ isAvailable: 1, "location.city": 1 });

// ── Auto-set thumbnail on save ────────────────────────────────
vehicleSchema.pre("save", async function () {
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0];
  }
});

// ── Virtual: price with GST ───────────────────────────────────
vehicleSchema.virtual("priceWithGST").get(function () {
  const gst = (this.basePricePerHour * this.gstPercent) / 100;
  return +(this.basePricePerHour + gst).toFixed(2);
});

// ── Virtual: is document fully verified ──────────────────────
vehicleSchema.virtual("isFullyVerified").get(function () {
  return (
    this.documents.rc.verified &&
    this.documents.puc.verified &&
    this.documents.insurance.verified
  );
});

// ── Method: update rating ─────────────────────────────────────
vehicleSchema.methods.updateRating = async function (newRating) {
  const total = this.stats.rating * this.stats.totalRatings + newRating;
  this.stats.totalRatings += 1;
  this.stats.rating = +(total / this.stats.totalRatings).toFixed(1);
  await this.save();
};

module.exports = mongoose.model("Vehicle", vehicleSchema, "vehicles");
