const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("[MEDIA] Cloudinary configured successfully.");
} else {
  console.warn(
    "[MEDIA WARNING] Cloudinary environment variables are missing! Using mock upload simulation fallback."
  );
}

// Multer parser setup using memory storage (to buffer files for direct streaming to Cloudinary)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mimeType = file.mimetype;
  if (file.fieldname === "images") {
    if (mimeType.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type: Images field only accepts image files."), false);
    }
  } else if (file.fieldname === "videos") {
    if (mimeType.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type: Videos field only accepts video files."), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max file size for videos
  },
});

/**
 * Upload buffer directly to Cloudinary using streams
 */
const uploadToCloudinary = (fileBuffer, fieldName, originalName) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      // Premium Mock upload url generation for offline developer testing
      const fakeUrl = `https://res.cloudinary.com/seven-hills/image/upload/v1716768000/mock_${Date.now()}_${originalName.replace(/\s+/g, "_")}`;
      console.log(`[MEDIA SIMULATOR] Mock upload success: ${fakeUrl}`);
      return resolve(fakeUrl);
    }

    const resourceType = fieldName === "videos" ? "video" : "image";
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "seven_hills_suites",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("[CLOUDINARY ERROR] Upload failed:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary,
  isCloudinaryConfigured,
};
