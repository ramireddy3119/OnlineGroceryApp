const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");
const authMiddleware = require("../middleware/authMiddleware");
const {authorizeRole} = require("../middleware/authMiddleware");
const upload = require("../middleware/cloudinaryUpload");

// Admin or Vendor can upload
router.post(
  "/upload",
  authMiddleware,
  authorizeRole(["admin", "vendor"]),
  upload.single("image"), // handle image upload
  productController.createProduct
);

// Admin or Vendor can update their own product
router.put(
  "update/:id",
  authMiddleware,
  authorizeRole(["admin", "vendor"]),
  upload.single("image"),
  productController.updateProduct
);

// Admin or Vendor can delete their own product
router.delete(
  "delete/:id",
  authMiddleware,
  authorizeRole(["admin", "vendor"]),
  productController.deleteProduct
);

// Vendor can fetch only their products
router.get(
  "/my-products",
  authMiddleware,
  authorizeRole(["vendor"]),
  productController.getVendorProducts
);

// Public products route (optional)
router.get("/", productController.getAllProducts);

// Admin can fetch all products with vendor info
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRole(["admin"]),
  productController.getAllProductsAdmin
);

router.get("/category/:category",productController.getProductBycategory);



module.exports = router;
