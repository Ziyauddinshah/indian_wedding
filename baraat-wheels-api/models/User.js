const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return password in queries
    },
    role: {
      type: String,
      enum: ["customer", "partner", "client", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    address: {
      line1: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    // ── Customer fields ──────────────────────────
    customerProfile: {
      totalBookings: { type: Number, default: 0 },
      loyaltyPoints: { type: Number, default: 0 },
      savedVehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" }],
    },

    // ── Partner (vehicle owner) fields ────────────
    partnerProfile: {
      businessName: { type: String },
      gstNumber: { type: String },
      panNumber: { type: String },
      isApproved: { type: Boolean, default: false },
      approvedAt: { type: Date, default: null },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      commissionRate: { type: Number, default: 15 },
      bankDetails: {
        accountHolder: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        bankName: { type: String },
        upiId: { type: String },
      },
      stats: {
        totalVehicles: { type: Number, default: 0 },
        totalBookings: { type: Number, default: 0 },
        totalEarnings: { type: Number, default: 0 },
        rating: { type: Number, default: 0 },
      },
    },

    // ── Admin fields ─────────────────────────────
    adminProfile: {
      employeeId: { type: String },
      department: { type: String },
      isSuperAdmin: { type: Boolean, default: false },
      permissions: {
        type: [String],
        enum: [
          "manage_users",
          "manage_vehicles",
          "approve_clients",
          "manage_bookings",
          "view_reports",
          "manage_payouts",
        ],
        default: [],
      },
    },

    // ── OTP fields ───────────────────────────────
    otp: {
      code: { type: String, default: null },
      expiresAt: { type: Date, default: null },
    },

    // ── Password reset ───────────────────────────
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
