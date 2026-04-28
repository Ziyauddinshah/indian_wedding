// models/Vehicle.js

const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    // ── Owner ────────────────────────────────────────────────
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },

    // ── Basic Info ───────────────────────────────────────────
    vehicleType: {
      type: String,
      required: [true, "Vehicle type is required"],
      enum: ["Sedan", "SUV", "Luxury Sedan", "Luxury SUV", "MUV", "Vintage"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    vehicleName: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    modelYear: {
      type: Number,
      required: [true, "Model year is required"],
      min: [1900, "Year seems too old"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    seatingCapacity: {
      type: Number,
      required: [true, "Seating capacity is required"],
      min: 2,
      max: 20,
    },
    color: {
      type: String,
      trim: true,
      default: null,
    },
    features: {
      type: [String],
      enum: [
        "AC",
        "GPS",
        "Music System",
        "Wedding Decoration",
        "Bonnet Decoration",
        "Sunroof",
        "Leather Seats",
        "Ventilated Seats",
        "Chauffeur",
      ],
      default: [],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // ── Pricing ──────────────────────────────────────────────
    basePricePerHour: {
      type: Number,
      required: [true, "Base price per hour is required"],
      min: [0, "Price cannot be negative"],
    },
    basePricePerDay: {
      type: Number,
      default: null,
    },
    extra_km_rate: {
      type: String,
      default: "150",
    },
    extra_hour_rate: {
      type: String,
      default: "1500",
    },
    currency: {
      type: String,
      default: "INR",
    },
    gstPercent: {
      type: Number,
      default: 18, // 18% GST applicable on vehicle rentals
    },

    // ── Location ─────────────────────────────────────────────
    location: {
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        default: "Uttar Pradesh",
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },

    // ── Documents ────────────────────────────────────────────
    rcNumber: {
      type: String,
      required: [true, "RC number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
        "Enter a valid RC number e.g. UP32AB1234",
      ],
    },
    pucNumber: {
      type: String,
      required: [true, "PUC number is required"],
      trim: true,
    },
    pucExpiry: {
      type: Date,
      default: null,
    },
    insuranceNumber: {
      type: String,
      required: [true, "Insurance number is required"],
      trim: true,
    },
    insuranceExpiry: {
      type: Date,
      default: null,
    },
    documents: {
      rc: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
      puc: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
      insurance: {
        url: { type: String, default: null },
        verified: { type: Boolean, default: false },
      },
    },

    // ── Images ───────────────────────────────────────────────
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Maximum 10 images are allowed",
      },
      default: [],
    },
    thumbnail: {
      type: String,
      default: null, // first image used as thumbnail
    },

    // ── Admin Review ─────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },

    // ── Availability ─────────────────────────────────────────
    is_active: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true, // false when booked
    },
    unavailableDates: {
      type: [Date],
      default: [], // manually blocked dates by partner
    },

    // ── Stats ────────────────────────────────────────────────
    stats: {
      totalBookings: { type: Number, default: 0 },
      totalEarnings: { type: Number, default: 0 },
      rating: { type: Number, default: 0, min: 0, max: 5 },
      totalRatings: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ───────────────────────────────────────────────────
vehicleSchema.index({ owner_id: 1 });
vehicleSchema.index({ status: 1, is_active: 1 });
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

module.exports = mongoose.model("Vehicle", vehicleSchema);
