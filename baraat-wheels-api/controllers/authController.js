const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate JWT ─────────────────────────────────────
const generateToken = (id, email, role, isActive) => {
  return jwt.sign(
    { id, email, role, isActive },
    process.env.JWT_SECRET || "your_jwt_secret_here",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

// ── Helper: send token response ──────────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id, user.email, user.role, user.isActive);

  // Remove sensitive fields
  user.password = undefined;
  user.otp = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// ────────────────────────────────────────────────────────────
// @route   POST /api/users/register
// @access  Public
// ────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    console.log(req.body);

    // Prevent direct admin registration via API
    if (role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts cannot be created via registration.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists.",
      });
    }

    const userData = { name, phone, email, password, role: role || "customer" };

    // Attach role-specific default profile
    if (role === "client") {
      userData.clientProfile = {
        businessName: req.body.businessName || "",
        gstNumber: req.body.gstNumber || "",
        panNumber: req.body.panNumber || "",
        isApproved: false,
        commissionRate: 15,
      };
    }

    if (!role || role === "customer") {
      userData.customerProfile = {
        totalBookings: 0,
        loyaltyPoints: 0,
      };
    }

    const user = await User.create(userData);
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   POST /api/users/login
// @access  Public
// ────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log(req.body);
    // ── 1. Basic field validation ──────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    // ── 2. Map frontend userType → DB role ─────────────────────────
    // Frontend sends: 'customer' | 'partner' | 'admin'
    // DB stores:      'client'   | 'partner' | 'admin'
    const FRONTEND_TO_DB_ROLE = {
      customer: "customer",
      partner: "partner",
      admin: "admin",
    };

    const expectedDbRole = FRONTEND_TO_DB_ROLE[userType];

    if (!expectedDbRole) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type selected.",
      });
    }

    // ── 3. Find user (include role + profiles for checks) ──────────
    const user = await User.findOne({ email }).select({
      password: 1,
      isActive: 1,
      role: 1,
      clientProfile: 1,
      partnerProfile: 1,
      name: 1,
      email: 1,
    });

    // ── 4. Wrong email or wrong password ───────────────────────────
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ── 5. Role mismatch — right password, wrong tab ───────────────
    // e.g. a partner trying to log in via the Customer tab
    if (user.role !== expectedDbRole) {
      const correctFrontendRole = FRONTEND_TO_DB_ROLE[user.role] || user.role;
      return res.status(403).json({
        success: false,
        message: `This account is registered as "${correctFrontendRole}". Please select the "${correctFrontendRole}" tab and try again.`,
      });
    }

    // ── 6. Deactivated account ─────────────────────────────────────
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // ── 7. Admin login — check adminCode if you use one ───────────
    if (user.role === "admin") {
      const { adminCode } = req.body;
      const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE;

      if (ADMIN_SECRET && adminCode !== ADMIN_SECRET) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code.",
        });
      }
    }

    // ── 8. Partner/Client pending approval — allow login but warn ──
    const isPendingPartner =
      user.role === "partner" && !user.partnerProfile?.isApproved;
    const isPendingClient =
      user.role === "client" && !user.clientProfile?.isApproved;

    if (isPendingPartner || isPendingClient) {
      const token = generateToken(
        user._id,
        user.email,
        user.role,
        user.isActive,
      );

      // Build a clean user object for the frontend
      const userPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: FRONTEND_TO_DB_ROLE[user.role] || user.role, // send 'customer' not 'client'
        isApproved: false,
      };

      return res.status(200).json({
        success: true,
        message: "Login successful. Your account is pending admin approval.",
        token,
        user: userPayload,
      });
    }

    // ── 9. All checks passed — send token response ─────────────────
    // Attach the frontend-friendly role before sending
    user._frontendRole = FRONTEND_TO_DB_ROLE[user.role] || user.role;
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error. Please try again.",
    });
  }
};

// ────────────────────────────────────────────────────────────
// @route   GET /api/users/me
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/update-profile
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "email", "phone", "address", "profileImage"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/change-password
// @access  Private (all roles)
// ────────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   PUT /api/users/admin/approve-client/:id
// @access  Private (admin only)
// ────────────────────────────────────────────────────────────
exports.approveClient = async (req, res) => {
  try {
    const client = await User.findOne({
      _id: req.params.id,
      role: "client",
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    client.clientProfile.isApproved = true;
    client.clientProfile.approvedAt = new Date();
    client.clientProfile.approvedBy = req.user._id;
    await client.save();

    res.status(200).json({
      success: true,
      message: `Client ${client.name} has been approved.`,
      user: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ────────────────────────────────────────────────────────────
// @route   DELETE /api/users/admin/deactivate/:id
// @access  Private (admin only)
// ────────────────────────────────────────────────────────────
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been deactivated.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
