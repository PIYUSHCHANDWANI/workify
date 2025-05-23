const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2; // require cloudinary v2
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();
const upload = multer();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`, 
});

// Helper function to upload file buffer to Cloudinary
const uploadFileToCloudinary = (buffer, folder, callback) => {
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder, resource_type: "image" },
    (error, result) => {
      if (error) {
        return callback(error);
      }
      return callback(null, result);
    }
  );
  uploadStream.end(buffer);
};

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  // For resume, we now require an image file (jpg, png, etc.)
  if (!file || !file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      message: "Invalid format. Only image files allowed for resumes.",
    });
  }

  uploadFileToCloudinary(file.buffer, "resumes", (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Error while uploading" });
    }
    res.send({
      message: "File uploaded successfully",
      url: result.secure_url,
    });
  });
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  // For profile images, allow only image file types
  if (!file || !file.mimetype.startsWith("image/")) {
    return res.status(400).json({
      message: "Invalid format. Only image files allowed for profile.",
    });
  }

  uploadFileToCloudinary(file.buffer, "profiles", (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Error while uploading" });
    }
    res.send({
      message: "Profile image uploaded successfully",
      url: result.secure_url,
    });
  });
});

module.exports = router;