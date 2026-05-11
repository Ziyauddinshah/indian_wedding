// data/dummyDB.js
const crypto = require("crypto");
const db = {
  users: [
    {
      id: "u1",
      name: "Admin User",
      email: "admin@vehicleapp.com",
      phone: "+1234567890",
      password: "$2b$12$hashed_admin_password", // bcrypt hash
      role: "admin",
      isActive: true,
      isVerified: true,
      createdAt: new Date("2024-01-01"),
      // Security fields
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date("2024-01-01"),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
      // Role profiles
      adminProfile: {
        permissions: ["all"],
        lastActivity: null,
      },
    },
    {
      id: "u2",
      name: "John Partner",
      email: "partner@vehicleapp.com",
      phone: "+1987654321",
      password: "$2b$12$hashed_partner_password",
      role: "partner",
      isActive: true,
      isVerified: true,
      createdAt: new Date("2024-01-15"),
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date("2024-01-15"),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
      // Partner profile
      partnerProfile: {
        businessName: "John's Rentals",
        gstNumber: "GST123456",
        panNumber: "PAN123456",
        isApproved: true,
        commissionRate: 15,
        totalVehicles: 0,
        totalEarnings: 0,
        rating: 0,
        documents: [],
      },
    },
    {
      id: "u3",
      name: "Alice Customer",
      email: "customer@vehicleapp.com",
      phone: "+1122334455",
      password: "$2b$12$hashed_customer_password",
      role: "customer",
      isActive: true,
      isVerified: true,
      createdAt: new Date("2024-02-20"),
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date("2024-02-20"),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
      // Customer profile
      customerProfile: {
        totalBookings: 0,
        loyaltyPoints: 0,
        favoriteVehicles: [],
        addresses: [],
      },
    },
    {
      id: "u3",
      name: "Customer1",
      email: "customer1@gmail.com",
      phone: "+1122334455",
      password: "$2b$12$hashed_customer_password",
      role: "customer",
      isActive: true,
      isVerified: true,
      createdAt: new Date("2024-02-20"),
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date("2024-02-20"),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
      // Customer profile
      customerProfile: {
        totalBookings: 0,
        loyaltyPoints: 0,
        favoriteVehicles: [],
        addresses: [],
      },
    },
    // Pending partner example
    {
      id: "u4",
      name: "Pending Partner",
      email: "pending@vehicleapp.com",
      phone: "+5544332211",
      password: "$2b$12$hashed_pending_password",
      role: "partner",
      isActive: true,
      isVerified: true,
      createdAt: new Date("2024-03-01"),
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date("2024-03-01"),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
      partnerProfile: {
        businessName: "New Rentals",
        gstNumber: "",
        panNumber: "",
        isApproved: false,
        commissionRate: 15,
        totalVehicles: 0,
        totalEarnings: 0,
        rating: 0,
        documents: [],
      },
    },
  ],

  resetTokens: new Map(), // hashedToken -> { userId, expiresAt }

  // Helper methods
  findUserByEmail(email) {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  },

  findUserById(id) {
    return this.users.find((u) => u.id === id);
  },

  findUserByPhone(phone) {
    return this.users.find((u) => u.phone === phone);
  },

  createUser(userData) {
    const user = {
      id: `u${Date.now()}`,
      ...userData,
      refreshTokens: [],
      passwordResetToken: null,
      passwordResetExpires: null,
      passwordChangedAt: new Date(),
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: null,
      lastLoginIp: null,
    };
    this.users.push(user);
    return user;
  },
};

// Helper methods
db.findUserByEmail = (email) => {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

db.findUserById = (id) => {
  return db.users.find((u) => u.id === id);
};

db.createUser = (userData) => {
  const user = {
    id: `u${Date.now()}`,
    ...userData,
    refreshTokens: [],
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: new Date(),
    loginAttempts: 0,
    lockUntil: null,
    lastLogin: null,
    lastLoginIp: null,
  };
  db.users.push(user);
  return user;
};

module.exports = db;
