// models/VehicleStats.js
const mongoose = require("mongoose");

const vehicleStatsSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Vehicle",
      index: true,
    },
    lastBooking: { type: Date },
    rating: { type: Number, default: 0 },
    statusDisplay: { type: String },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  "VehicleStats",
  vehicleStatsSchema,
  "vehicle_stats",
);
