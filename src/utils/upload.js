// File Upload Utility with Folder Organization
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

// Folder mapping for different image types
const folderMap = {
  products: "products-images",
  product: "products-images",
  home: "home",
  banner: "home",
  banners: "home",
  news: "news",
  client: "clients",
  clients: "clients",
  general: "general",
  default: "general",
};

/**
 * Get upload folder based on type
 */
export const getUploadFolder = (type = "general") => {
  const folderName = folderMap[type.toLowerCase()] || folderMap["default"];
  const folderPath = path.join(uploadsRoot, folderName);

  // Ensure folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return folderPath;
};

/**
 * Generate unique filename
 */
const generateFilename = (req, file, cb) => {
  const type = req.body.type || req.query.type || "general";
  console.log("generateFilename - type:", type, "body:", req.body);
  const folder = getUploadFolder(type);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const filename = `image-${uniqueSuffix}${ext}`;
  req.uploadedFilePath = path.join(folder, filename);
  req.uploadedFileUrl = `/uploads/${
    folderMap[type.toLowerCase()] || "general"
  }/${filename}`;
  console.log("Generated file path:", req.uploadedFilePath);
  console.log("Generated file URL:", req.uploadedFileUrl);
  cb(null, filename);
};

/**
 * Configure storage
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type || req.query.type || "general";
    console.log("multer destination - type:", type, "body:", req.body);
    const folder = getUploadFolder(type);
    console.log("multer destination folder:", folder);
    cb(null, folder);
  },
  filename: generateFilename,
});

/**
 * File filter - only images
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

/**
 * Create multer upload instance
 */
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

/**
 * Delete file helper
 */
export const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
  return false;
};

/**
 * Delete file by URL
 */
export const deleteFileByUrl = (url) => {
  if (!url || !url.startsWith("/uploads/")) {
    return false;
  }

  const filePath = path.join(__dirname, "../..", url);
  return deleteFile(filePath);
};

/**
 * Get file path from URL
 */
export const getFilePathFromUrl = (url) => {
  if (!url || !url.startsWith("/uploads/")) {
    return null;
  }
  return path.join(__dirname, "../..", url);
};
