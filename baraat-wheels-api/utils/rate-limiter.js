const rateLimit = require("express-rate-limit");

// Simplified version that works with Express routes
const dynamicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: (req) => {
    if (req.user && req.user.role === "admin") {
      return 300; // Admin users
    }
    return 100; // Regular users
  },
  message: {
    status: false,
    message: "Too many requests, please try again later",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});

module.exports = { dynamicLimiter };
