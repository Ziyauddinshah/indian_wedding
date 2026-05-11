const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const errorHandler = require("./utils/errorHandler");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON bodies

// Allow requests from your frontend origin with credentials
// CORS - Adjust for production
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Important for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Request logging (development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// Connect to MongoDB
const connectDB = require("./database/db");
connectDB();

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const vehicleRoutes = require("./routes/vehicleRoutes");
app.use("/api/vehicles", vehicleRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//Home page
app.use("/", (req, res) => {
  res.status(200).send("Home Page of Baraat Wheels Server");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    features: [
      "JWT Auth",
      "Remember Me",
      "Forgot Password",
      "Role-Based Access",
      "Account Lockout",
    ],
  });
});

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Vehicle Rental API running on http://localhost:${PORT}`);
  console.log(`🔐 Auth endpoints:`);
  console.log(
    `   POST /api/auth/register          - Register (customer/partner)`,
  );
  console.log(
    `   POST /api/auth/login             - Login (with role validation)`,
  );
  console.log(`   POST /api/auth/refresh           - Refresh tokens`);
  console.log(`   POST /api/auth/logout            - Logout current device`);
  console.log(`   POST /api/auth/logout-all         - Logout all devices`);
  console.log(`   GET  /api/auth/me                - Get current user`);
  console.log(`   PUT  /api/auth/update-profile    - Update profile`);
  console.log(`   POST /api/auth/change-password   - Change password`);
  console.log(`   POST /api/auth/forgot-password    - Request password reset`);
  console.log(`   GET  /api/auth/verify-reset-token - Verify reset token`);
  console.log(`   POST /api/auth/reset-password     - Reset password`);
  console.log(`   GET  /api/auth/sessions          - List active sessions`);
  console.log(
    `   PATCH /api/auth/admin/approve-partner/:id  - Approve partner`,
  );
  console.log(
    `   PATCH /api/auth/admin/deactivate/:id       - Deactivate user`,
  );
  console.log(`   GET  /api/auth/admin/users        - List all users`);
  console.log(`✅ server running on port ${PORT}`);
});
