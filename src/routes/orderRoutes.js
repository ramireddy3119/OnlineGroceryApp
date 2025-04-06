const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkout", authMiddleware, orderController.placeOrder);
router.get("/my-orders/", authMiddleware, orderController.getUserOrders);

module.exports = router;
