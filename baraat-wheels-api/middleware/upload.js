// middleware/upload.js
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const { getDb } = require("../database/db"); // Assume a function to get your DB instance

// Configure multer to store files in memory as a buffer.
// This is necessary for streaming directly to GridFS without saving to disk first.
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Optional: Set a 50MB file size limit
});

// Middleware function to handle the GridFS upload after multer has processed the file
const uploadToGridFS = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("No file provided"));
  }

  const db = getDb();
  const bucket = new GridFSBucket(db, {
    bucketName: "uploads", // Name of your GridFS bucket (creates uploads.files & uploads.chunks)
  });

  // Create a readable stream from the file buffer
  const readableStream = new (require("stream").Readable)();
  readableStream.push(req.file.buffer);
  readableStream.push(null);

  // Create an upload stream to GridFS
  const uploadStream = bucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    metadata: {
      // Add any custom metadata from req.body here
      uploadedBy: req.body.userId,
      description: req.body.description,
    },
  });

  readableStream
    .pipe(uploadStream)
    .on("error", (error) => {
      next(error);
    })
    .on("finish", () => {
      // Attach the GridFS file ID to the request object for later use
      req.file.gridFSId = uploadStream.id;
      next();
    });
};

module.exports = { upload, uploadToGridFS };
