// Product Routes
import express from "express";
import * as productController from "../controllers/productController.js";
import { noCache } from "../middleware/noCache.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/", noCache, productController.getAllProducts);
router.get("/:id", noCache, productController.getProductById);
router.post(
  "/",
  (req, res, next) => {
    // Set type to 'products' for product images BEFORE multer processes
    req.body.type = "products";
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message || 'File upload failed' });
      }
      next();
    });
  },
  productController.createProduct
);
router.put(
  "/:id",
  (req, res, next) => {
    // Set type to 'products' for product images BEFORE multer processes
    req.body.type = "products";
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message || 'File upload failed' });
      }
      next();
    });
  },
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
