const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authMiddleware = require("../middleware/authMiddleware");

const { isVendor, isAdmin } = require("../middleware/authMiddleware");

// Vendor routes
router.post("/", authMiddleware, isVendor, productController.createProduct);
router.put("/:id", authMiddleware, isVendor, productController.updateProduct);
router.delete("/:id", authMiddleware, isVendor, productController.deleteProduct);
router.get("/vendor", authMiddleware, isVendor, productController.getVendorProducts);

// Public route
router.get("/", productController.getAllProducts);

// Admin-only route
router.get("/admin", authMiddleware, isAdmin, productController.getAllProductsAdmin);

module.exports = router;
