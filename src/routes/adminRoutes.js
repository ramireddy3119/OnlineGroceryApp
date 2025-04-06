const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

router.get("/users",authMiddleware,isAdmin, adminController.getAllUsers);
router.get("/users/:id",authMiddleware, isAdmin, adminController.getUserById);
router.put("/users/:id", authMiddleware,isAdmin, adminController.updateUser);
router.delete("/users/:id", authMiddleware,isAdmin, adminController.deleteUser);

router.post("/products", authMiddleware,isAdmin, adminController.addProduct);
router.put("/products/:id", authMiddleware,isAdmin, adminController.updateProduct);
router.delete("/products/:id", authMiddleware,isAdmin, adminController.deleteProduct);
router.get("/products", authMiddleware,isAdmin, adminController.getAllProducts);
router.get("/orders", authMiddleware,isAdmin, adminController.getAllOrders);
router.put("/orders/:id", authMiddleware,isAdmin, adminController.updateOrder);
router.delete("/orders/:id", authMiddleware,isAdmin, adminController.deleteOrder);









module.exports = router;
