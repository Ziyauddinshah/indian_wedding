// models/Booking.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

// ==================== ENUMS ====================

const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  AWAITING_PICKUP: "awaiting_pickup",
  IN_PROGRESS: "in_progress",
  OVERDUE: "overdue",
  RETURNED: "returned",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
  DISPUTED: "disputed",
};

const PaymentStatus = {
  PENDING: "pending",
  PARTIALLY_PAID: "partially_paid",
  PAID: "paid",
  REFUNDED: "refunded",
  FAILED: "failed",
};

const PaymentMethod = {
  CARD: "card",
  UPI: "upi",
  NETBANKING: "netbanking",
  WALLET: "wallet",
  CASH: "cash",
};

const RefundStatus = {
  PENDING: "pending",
  PROCESSED: "processed",
  FAILED: "failed",
};

// ==================== SUB-SCHEMAS ====================

const CoordinatesSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false },
);

const LocationSchema = new Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, default: null },
  },
  { _id: false },
);

// ==================== MAIN SCHEMA ====================

const BookingSchema = new Schema(
  {
    // ── IDENTIFICATION ──────────────────────────────────────
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. "BK-2024-00123"
    },

    // ── VEHICLE INFORMATION ─────────────────────────────────
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },
    vehicleDetails: {
      name: { type: String, required: true },
      company: { type: String, required: true },
      type: { type: String, required: true }, // luxury | ghodi | royal
      pricePerDay: { type: Number, required: true, min: 0 },
      images: [{ type: String }],
    },

    // ── USER INFORMATION ────────────────────────────────────
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: null },
      profileImage: { type: String, default: null },
    },

    // ── RENTAL DETAILS ──────────────────────────────────────
    rentalDetails: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      totalDays: { type: Number, required: true, min: 1 },
      pickupLocation: { type: LocationSchema, required: true },
      returnLocation: { type: LocationSchema, required: true },
      isSameLocation: { type: Boolean, required: true, default: true },
    },

    // ── PRICING DETAILS ─────────────────────────────────────
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0, default: 0 },
      discount: { type: Number, required: true, min: 0, default: 0 },
      discountCode: { type: String, default: null },
      securityDeposit: { type: Number, required: true, min: 0, default: 0 },
      deliveryCharges: { type: Number, required: true, min: 0, default: 0 },
      cleaningCharges: { type: Number, required: true, min: 0, default: 0 },
      totalAmount: { type: Number, required: true, min: 0 },
      amountPaid: { type: Number, required: true, min: 0, default: 0 },
      paymentStatus: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
      },
    },

    // ── PAYMENT INFORMATION ─────────────────────────────────
    paymentDetails: {
      transactionId: { type: String, default: null },
      paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
      },
      paymentGateway: { type: String, required: true }, // razorpay | stripe | paytm …
      paidAt: { type: Date, default: null },
      refundAmount: { type: Number, min: 0, default: null },
      refundStatus: {
        type: String,
        enum: [...Object.values(RefundStatus), null],
        default: null,
      },
      refundTransactionId: { type: String, default: null },
      invoiceNumber: { type: String, default: null },
      invoiceUrl: { type: String, default: null },
    },

    // ── DRIVER INFORMATION ──────────────────────────────────
    driverDetails: {
      isWithDriver: { type: Boolean, default: false },
      driverId: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
      },
      driverName: { type: String, default: null },
      driverPhone: { type: String, default: null },
      driverLicense: { type: String, default: null },
      driverCharge: { type: Number, min: 0, default: 0 },
    },

    // ── DOCUMENTS ───────────────────────────────────────────
    documents: {
      agreementSigned: { type: Boolean, default: false },
      agreementUrl: { type: String, default: null },
      idProofRenter: { type: String, default: null },
      drivingLicense: { type: String, default: null },
      vehiclePhotos: {
        pickup: [{ type: String }],
        return: [{ type: String }],
      },
    },

    // ── STATUS & TIMELINE ───────────────────────────────────
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },

    timeline: {
      bookingDate: { type: Date, required: true, default: Date.now },
      confirmedAt: { type: Date, default: null },
      pickupAt: { type: Date, default: null },
      returnAt: { type: Date, default: null },
      cancelledAt: { type: Date, default: null },
      completedAt: { type: Date, default: null },
      lastUpdated: { type: Date, required: true, default: Date.now },
    },

    // ── CANCELLATION DETAILS ────────────────────────────────
    cancellation: {
      cancelledBy: {
        type: String,
        enum: ["user", "vendor", "system"],
      },
      reason: { type: String },
      cancelledAt: { type: Date },
      refundAmount: { type: Number, min: 0, default: 0 },
      cancellationCharges: { type: Number, min: 0, default: 0 },
      refundStatus: {
        type: String,
        enum: Object.values(RefundStatus),
      },
    },

    // ── RATINGS & REVIEW ────────────────────────────────────
    review: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      reviewedAt: { type: Date },
      vendorResponse: { type: String, default: null },
      vendorResponseAt: { type: Date, default: null },
    },

    // ── NOTIFICATIONS ───────────────────────────────────────
    notifications: {
      bookingConfirmed: { type: Boolean, default: false },
      pickupReminder: { type: Boolean, default: false },
      returnReminder: { type: Boolean, default: false },
      paymentReminder: { type: Boolean, default: false },
      reviewRequest: { type: Boolean, default: false },
    },

    // ── ADDITIONAL FIELDS ───────────────────────────────────
    specialRequests: { type: String, default: null },
    notes: { type: String, default: null },

    metadata: {
      source: { type: String, default: null }, // Web | App | WhatsApp …
      utmSource: { type: String, default: null },
      utmCampaign: { type: String, default: null },
      ipAddress: { type: String, default: null },
      deviceInfo: { type: String, default: null },
    },

    // ── AUDIT FIELDS ────────────────────────────────────────
    audit: {
      createdBy: { type: String, required: true },
      createdAt: { type: Date, required: true, default: Date.now },
      updatedBy: { type: String, required: true },
      updatedAt: { type: Date, required: true, default: Date.now },
      version: { type: Number, required: true, default: 1 }, // optimistic locking
    },
  },
  {
    timestamps: false, // managed manually in `audit` block
    versionKey: false,
  },
);

// ==================== INDEXES ====================

// Speed up common queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ vehicleId: 1, status: 1 });
BookingSchema.index({
  "rentalDetails.startDate": 1,
  "rentalDetails.endDate": 1,
});
BookingSchema.index({ "pricing.paymentStatus": 1 });
BookingSchema.index({ bookingNumber: 1 }, { unique: true });

// ==================== PRE-SAVE HOOK ====================

// Auto-bump audit version and update lastUpdated on every save
BookingSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.audit.version += 1;
    this.audit.updatedAt = new Date();
    this.timeline.lastUpdated = new Date();
  }
  next();
});

// ==================== MODEL ====================

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = {
  Booking,
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
  RefundStatus,
};
