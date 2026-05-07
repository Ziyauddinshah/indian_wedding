// utils/authUtils.js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production";
const JWT_ACCESS_EXPIRY = "15m"; // Short-lived access token
const JWT_REFRESH_EXPIRY_SHORT = "7d"; // Normal refresh token
const JWT_REFRESH_EXPIRY_LONG = "30d"; // Remember Me refresh token
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours lockout
const SALT_ROUNDS = 12;

/**
 * Generate Access Token (short-lived, contains user info)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRY },
  );
};

/**
 * Generate Refresh Token (long-lived, random string stored in DB)
 * @param {boolean} rememberMe - If true, token lasts 30 days, else 7 days
 */
const generateRefreshToken = (rememberMe = false) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresIn = rememberMe
    ? JWT_REFRESH_EXPIRY_LONG
    : JWT_REFRESH_EXPIRY_SHORT;
  const days = rememberMe ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  return { token, expiresAt, expiresIn };
};

/**
 * Hash token for storage (prevents DB theft from being usable)
 */
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Generate Password Reset Token
 * Returns raw token (sent to user) and stores hashed version
 */
const generatePasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  return { raw: rawToken, hashed: hashedToken, expiresAt };
};

/**
 * Check if account is locked due to failed attempts
 */
const isAccountLocked = (user) => {
  if (!user.lockUntil) return false;
  return user.lockUntil > Date.now();
};

/**
 * Increment login attempts, lock if exceeded
 */
const incrementLoginAttempts = (user) => {
  if (user.lockUntil && user.lockUntil < Date.now()) {
    user.loginAttempts = 0;
    user.lockUntil = null;
  }
  user.loginAttempts += 1;
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.lockUntil = Date.now() + LOCK_TIME;
  }
  return user;
};

/**
 * Reset login attempts on successful login
 */
const resetLoginAttempts = (user) => {
  user.loginAttempts = 0;
  user.lockUntil = null;
  return user;
};

/**
 * Verify if JWT was issued before password change
 */
const isTokenIssuedBeforePasswordChange = (jwtTimestamp, passwordChangedAt) => {
  if (!passwordChangedAt) return false;
  const changedTimestamp = Math.floor(passwordChangedAt.getTime() / 1000);
  return jwtTimestamp < changedTimestamp;
};

/**
 * Set token cookies
 */
const setTokenCookies = (
  res,
  accessToken,
  refreshToken,
  rememberMe = false,
) => {
  // Access token - short lived
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Refresh token - longer lived
  const refreshMaxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 7 * 24 * 60 * 60 * 1000; // 7 days

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshMaxAge,
    path: "/api/auth/refresh",
  });
};

/**
 * Clear token cookies
 */
const clearTokenCookies = (res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/api/auth/refresh",
    sameSite: "strict",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  generatePasswordResetToken,
  isAccountLocked,
  incrementLoginAttempts,
  resetLoginAttempts,
  isTokenIssuedBeforePasswordChange,
  setTokenCookies,
  clearTokenCookies,
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
};
