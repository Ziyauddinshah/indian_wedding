const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    pickupOtp: {
      type: String,
      required: true,
      length: 4,
    },
    dropOtp: {
      type: String,
      required: true,
      length: 4,
    },

    pickup: {
      address: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
          index: "2dsphere",
        },
      },
      landmark: {
        type: String,
      },
      instructions: {
        type: String,
      },
    },

    drop: {
      address: {
        type: String,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          required: true,
          index: "2dsphere",
        },
      },
      landmark: {
        type: String,
      },
      instructions: {
        type: String,
      },
    },

    timeline: {
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      confirmedAt: {
        type: Date,
      },
      partnerAssignedAt: {
        type: Date,
      },
      startedAt: {
        type: Date,
      },
      completedAt: {
        type: Date,
      },
      cancelledAt: {
        type: Date,
      },
      disputedAt: {
        type: Date,
      },
      estimatedArrival: {
        type: Date,
      },
      estimatedDropTime: {
        type: Date,
      },
    },

    fare: {
      base: {
        type: Number,
        required: true,
        min: 0,
      },
      distanceCharge: {
        type: Number,
        required: true,
        min: 0,
      },
      timeCharge: {
        type: Number,
        required: true,
        min: 0,
      },
      surgeMultiplier: {
        type: Number,
        default: 1.0,
        min: 1.0,
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        required: true,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "USD", "EUR", "GBP"],
      },
      couponCode: {
        type: String,
      },
      couponDiscount: {
        type: Number,
        default: 0,
      },
      waitCharge: {
        type: Number,
        default: 0,
      },
      tollCharge: {
        type: Number,
        default: 0,
      },
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
    },

    cancelledBy: {
      type: String,
      enum: ["user", "partner", "system", null],
      default: null,
    },
    cancellationReason: {
      type: String,
      enum: [
        "changed_mind",
        "ride_taking_too_long",
        "unavailable",
        "vehicle_issue",
        "traffic",
        "wrong_address",
        "weather",
        "other",
      ],
      default: null,
    },
    cancellationReasonText: {
      type: String,
    },
    cancellationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    tracking: [
      {
        coordinates: {
          type: [Number],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        accuracy: {
          type: Number,
          min: 0,
        },
        speed: {
          type: Number,
          min: 0,
        },
        heading: {
          type: Number,
          min: 0,
          max: 360,
        },
        altitude: {
          type: Number,
        },
      },
    ],

    isReviewedByUser: {
      type: Boolean,
      default: false,
    },
    isReviewedByPartner: {
      type: Boolean,
      default: false,
    },

    userRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    partnerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    userFeedback: {
      type: String,
      maxlength: 500,
    },
    partnerFeedback: {
      type: String,
      maxlength: 500,
    },

    metadata: {
      deviceInfo: {
        type: String,
      },
      appVersion: {
        type: String,
      },
      ipAddress: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      estimatedDistance: {
        type: Number,
        min: 0,
      },
      estimatedDuration: {
        type: Number,
        min: 0,
      },
      actualDistance: {
        type: Number,
        min: 0,
      },
      actualDuration: {
        type: Number,
        min: 0,
      },
    },

    retryCount: {
      type: Number,
      default: 0,
    },
    lastRetryAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: "bookings",
  },
  {
  timestamps: true,
  collection: 'bookings',
  strict: true,
  versionKey: '__v',
  minimize: false,
  
  // Auto-index for production
  autoIndex: process.env.NODE_ENV !== 'production',
  
  // Customize JSON output
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  },
  
  toObject: {
    virtuals: true
  }
}
);


// Enable sharding for large datasets
bookingSchema.options.shardKey = { userId: 1 };

// Indexes for performance
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ partnerId: 1, status: 1 });
bookingSchema.index({ vehicleId: 1, status: 1 });
bookingSchema.index({ "pickup.location": "2dsphere" });
bookingSchema.index({ "drop.location": "2dsphere" });
bookingSchema.index({ status: 1, "timeline.createdAt": -1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ "timeline.createdAt": -1 });
bookingSchema.index({ status: 1, "timeline.completedAt": 1 });
bookingSchema.index({ cancelledAt: 1 }, { sparse: true });

// Compound indexes for common queries
bookingSchema.index({
  userId: 1,
  "timeline.createdAt": -1,
});

bookingSchema.index({
  partnerId: 1,
  status: 1,
  "timeline.createdAt": -1,
});

// Pre-save middleware
bookingSchema.pre("save", function (next) {
  // Auto-calculate subtotal and total if not provided
  if (this.isNew && this.fare) {
    this.fare.subtotal =
      this.fare.base + this.fare.distanceCharge + this.fare.timeCharge;
    this.fare.subtotal = this.fare.subtotal * this.fare.surgeMultiplier;
    this.fare.total = this.fare.subtotal + this.fare.tax - this.fare.discount;
  }

  // Set timeline dates based on status changes
  if (this.isModified("status")) {
    const now = new Date();
    switch (this.status) {
      case "confirmed":
        this.timeline.confirmedAt = now;
        break;
      case "in_progress":
        this.timeline.startedAt = now;
        break;
      case "completed":
        this.timeline.completedAt = now;
        break;
      case "cancelled":
        this.timeline.cancelledAt = now;
        break;
      case "disputed":
        this.timeline.disputedAt = now;
        break;
    }
  }

  next();
});

// Instance methods
bookingSchema.methods = {
  // Calculate total fare
  calculateTotal: function () {
    const fare = this.fare;
    fare.subtotal =
      (fare.base + fare.distanceCharge + fare.timeCharge) *
      fare.surgeMultiplier;
    fare.total = fare.subtotal + fare.tax - fare.discount;
    return fare.total;
  },

  // Check if booking can be cancelled
  canCancel: function () {
    return ["pending", "confirmed", "in_progress"].includes(this.status);
  },

  // Check if booking can be disputed
  canDispute: function () {
    return this.status === "completed" && !this.isReviewedByUser;
  },

  // Get duration of trip
  getTripDuration: function () {
    if (this.timeline.startedAt && this.timeline.completedAt) {
      return (this.timeline.completedAt - this.timeline.startedAt) / 1000 / 60; // in minutes
    }
    return null;
  },
};

// Static methods
bookingSchema.statics = {
  // Find active bookings by userId
  findActiveByUser: function (userId) {
    return this.find({
      userId: userId,
      status: { $in: ["pending", "confirmed", "in_progress"] },
    }).sort({ "timeline.createdAt": -1 });
  },

  // Find bookings by date range
  findByDateRange: function (startDate, endDate) {
    return this.find({
      "timeline.createdAt": {
        $gte: startDate,
        $lte: endDate,
      },
    });
  },

  // Get revenue summary
  getRevenueSummary: function (startDate, endDate) {
    return this.aggregate([
      {
        $match: {
          status: "completed",
          "timeline.completedAt": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fare.total" },
          totalBookings: { $sum: 1 },
          avgFare: { $avg: "$fare.total" },
        },
      },
    ]);
  },
};

const bookingValidation = {
  pickupOtp: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}$/.test(v);
      },
      message: props => `${props.value} is not a valid 4-digit OTP!`
    }
  },
  
  status: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed'].includes(v);
      },
      message: props => `${props.value} is not a valid status!`
    }
  }
};


// Enable sharding for large datasets
bookingSchema.options.shardKey = { userId: 1 };

// Virtual fields
bookingSchema.virtual("isActive").get(function () {
  return ["pending", "confirmed", "in_progress"].includes(this.status);
});

bookingSchema.virtual("isCompleted").get(function () {
  return this.status === "completed";
});

// Create model
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
