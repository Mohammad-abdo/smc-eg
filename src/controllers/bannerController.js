// Banners Controller
import prisma from "../config/database.js";
import { deleteFileByUrl } from "../utils/upload.js";

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    res.json(banners);
  } catch (error) {
    // Handle connection errors
    if (
      error.code === "ECONNRESET" ||
      error.code === "ECONNREFUSED" ||
      error.message?.includes("ECONNRESET")
    ) {
      return res.status(503).json({
        error: "Database connection error. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    console.log('=== CREATE BANNER ===');
    console.log('req.file:', req.file ? { filename: req.file.filename, size: req.file.size, mimetype: req.file.mimetype } : 'No file');
    console.log('req.body:', req.body);
    console.log('req.uploadedFileUrl:', req.uploadedFileUrl);
    
    // Extract only the fields that belong to the Banner model
    const { title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;
    
    // Determine image value
    let image = null;
    if (req.file) {
      // Use uploadedFileUrl if available, otherwise construct it
      if (req.uploadedFileUrl) {
        image = req.uploadedFileUrl;
        console.log('Using uploadedFileUrl:', req.uploadedFileUrl);
      } else {
        // Fallback: construct the path manually
        const folderName = 'home'; // Banners go to home folder
        const filename = req.file.filename;
        image = `/uploads/${folderName}/${filename}`;
        console.log('Constructed image path:', image);
      }
      console.log('Banner image path saved:', image);
    } else if (req.body.image && req.body.image.startsWith("data:image")) {
      // If base64 image is provided, keep it (backward compatibility)
      image = req.body.image;
      console.log('Using base64 image');
    }

    // Build data object with only valid Prisma fields (exclude type, id, createdAt, updatedAt)
    const data = {
      title: title || null,
      titleAr: titleAr || null,
      subtitle: subtitle || null,
      subtitleAr: subtitleAr || null,
      description: description || null,
      descriptionAr: descriptionAr || null,
      order: order ? parseInt(order) : 0,
      active: active === 'true' || active === true || active === '1',
      image: image,
    };

    console.log('Final data to save:', { ...data, image: data.image ? (data.image.substring(0, 50) + '...') : null });
    
    const banner = await prisma.banner.create({ data });
    console.log('Banner created successfully with image:', banner.image);
    res.json(banner);
  } catch (error) {
    // If file was uploaded but database save failed, delete the file
    if (req.file && req.uploadedFilePath) {
      deleteFileByUrl(req.uploadedFileUrl);
    }

    // Handle connection errors
    if (
      error.code === "ECONNRESET" ||
      error.code === "ECONNREFUSED" ||
      error.message?.includes("ECONNRESET")
    ) {
      return res.status(503).json({
        error: "Database connection error. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const bannerId = parseInt(req.params.id);

    // Get existing banner to check for old image
    const existingBanner = await prisma.banner.findUnique({
      where: { id: bannerId },
    });

    if (!existingBanner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Extract only the fields that belong to the Banner model
    const { title, titleAr, subtitle, subtitleAr, description, descriptionAr, order, active } = req.body;

    // Determine image value
    let image = existingBanner.image; // Keep existing image by default
    
    if (req.file) {
      // Delete old image file if it exists and is a file path (not base64)
      if (
        existingBanner.image &&
        existingBanner.image.startsWith("/uploads/")
      ) {
        deleteFileByUrl(existingBanner.image);
      }
      // Use uploadedFileUrl if available, otherwise construct it
      if (req.uploadedFileUrl) {
        image = req.uploadedFileUrl;
      } else {
        // Fallback: construct the path manually
        const folderName = 'home'; // Banners go to home folder
        const filename = req.file.filename;
        image = `/uploads/${folderName}/${filename}`;
      }
      console.log('Banner image path updated:', image);
    } else if (req.body.image && req.body.image.startsWith("data:image")) {
      // If base64 image is provided, keep it (backward compatibility)
      image = req.body.image;
    } else if (req.body.image === null || req.body.image === "") {
      // If image is being removed
      if (
        existingBanner.image &&
        existingBanner.image.startsWith("/uploads/")
      ) {
        deleteFileByUrl(existingBanner.image);
      }
      image = null;
    }

    // Build data object with only valid Prisma fields (exclude type, id, createdAt, updatedAt)
    const data = {};
    
    // Only include fields that are provided and valid
    if (title !== undefined) data.title = title || null;
    if (titleAr !== undefined) data.titleAr = titleAr || null;
    if (subtitle !== undefined) data.subtitle = subtitle || null;
    if (subtitleAr !== undefined) data.subtitleAr = subtitleAr || null;
    if (description !== undefined) data.description = description || null;
    if (descriptionAr !== undefined) data.descriptionAr = descriptionAr || null;
    if (order !== undefined) data.order = order ? parseInt(order) : existingBanner.order;
    if (active !== undefined) data.active = active === 'true' || active === true || active === '1';
    if (image !== undefined) data.image = image;

    // Retry logic for connection errors
    let retries = 2;
    let lastError;

    while (retries >= 0) {
      try {
        const banner = await prisma.banner.update({
          where: { id: bannerId },
          data,
        });

        return res.json(banner);
      } catch (error) {
        lastError = error;

        // If file was uploaded but database save failed, delete the new file
        if (req.file && req.uploadedFilePath) {
          deleteFileByUrl(req.uploadedFileUrl);
        }

        // Check if it's a connection error
        const isConnectionError =
          error.code === "ECONNRESET" ||
          error.code === "ECONNREFUSED" ||
          error.message?.includes("ECONNRESET") ||
          error.message?.includes("write ECONNRESET");

        if (isConnectionError && retries > 0) {
          retries--;
          // Wait a bit before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 200 * (3 - retries))
          );
          continue;
        } else {
          // Not a connection error or no more retries, break and handle
          break;
        }
      }
    }

    // Handle final error
    if (lastError.code === "P2025") {
      return res.status(404).json({ error: "Banner not found" });
    }

    // If it's still a connection error after retries
    const isConnectionError =
      lastError.code === "ECONNRESET" ||
      lastError.code === "ECONNREFUSED" ||
      lastError.message?.includes("ECONNRESET") ||
      lastError.message?.includes("write ECONNRESET");

    if (isConnectionError) {
      return res.status(503).json({
        error: "Database connection error. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? lastError.message
            : undefined,
      });
    }

    next(lastError);
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    // Get banner first to delete associated image file
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Delete image file if it exists and is a file path (not base64)
    if (banner.image && banner.image.startsWith("/uploads/")) {
      deleteFileByUrl(banner.image);
    }

    await prisma.banner.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Banner not found" });
    }
    // Handle connection errors
    if (
      error.code === "ECONNRESET" ||
      error.code === "ECONNREFUSED" ||
      error.message?.includes("ECONNRESET")
    ) {
      return res.status(503).json({
        error: "Database connection error. Please try again.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
    next(error);
  }
};
