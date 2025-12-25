// Media Controller
import prisma from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.join(__dirname, '../../uploads');

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper function to get all files from a directory
const getFilesFromDir = (dirPath, folderName) => {
  const files = [];
  try {
    if (!fs.existsSync(dirPath)) {
      return files;
    }
    const fileList = fs.readdirSync(dirPath);
    fileList.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile()) {
        // Only include image files
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          files.push({
            id: `${folderName}-${file}`, // Unique ID based on folder and filename
            name: file,
            url: `/uploads/${folderName}/${file}`,
            size: formatFileSize(stat.size),
            sizeBytes: stat.size,
            type: 'image',
            folder: folderName,
            uploaded: stat.mtime.toISOString(),
            modified: stat.mtime.toISOString(),
          });
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  return files;
};

export const getAllMedia = async (req, res, next) => {
  try {
    const allMedia = [];
    const folders = ['home', 'products-images', 'news', 'clients', 'general'];

    folders.forEach((folder) => {
      const folderPath = path.join(uploadsRoot, folder);
      const files = getFilesFromDir(folderPath, folder);
      allMedia.push(...files);
    });

    // Sort by upload date (newest first)
    allMedia.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));

    res.json(allMedia);
  } catch (error) {
    console.error('Error getting media:', error);
    next(error);
  }
};

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // The file is already uploaded by multer middleware
    // We just need to return the file info
    const fileInfo = {
      id: `general-${req.file.filename}`,
      name: req.file.originalname,
      url: `/uploads/general/${req.file.filename}`,
      size: formatFileSize(req.file.size),
      sizeBytes: req.file.size,
      type: req.file.mimetype.startsWith('image/') ? 'image' : 'file',
      folder: 'general',
      uploaded: new Date().toISOString(),
      modified: new Date().toISOString(),
    };

    res.json(fileInfo);
  } catch (error) {
    console.error('Error uploading media:', error);
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Parse the ID to get folder and filename
    // Format: "folder-filename.ext"
    const parts = id.split('-');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }

    const folder = parts[0];
    const filename = parts.slice(1).join('-'); // Rejoin in case filename has dashes

    const filePath = path.join(uploadsRoot, folder, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`Deleted media file: ${filePath}`);

    res.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    next(error);
  }
};

