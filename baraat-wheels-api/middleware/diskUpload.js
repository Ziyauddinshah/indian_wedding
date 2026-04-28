// middleware/diskUpload.js
const multer = require("multer");
const path = require("path");

// Configure storage on disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter to accept only images and PDFs
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed!"), false);
  }
};

const uploadDisk = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit (under 16MB)
});

module.exports = uploadDisk;
