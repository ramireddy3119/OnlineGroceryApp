const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartContoller");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, cartController.addToCart);
router.get("/", authMiddleware, cartController.getUserCart);
router.put("/update/:cartId", authMiddleware, cartController.updateCartItem);
router.delete("/remove/:cartId", authMiddleware, cartController.removeCartItem);
router.delete("/clear", authMiddleware, cartController.clearCart);

module.exports = router;
