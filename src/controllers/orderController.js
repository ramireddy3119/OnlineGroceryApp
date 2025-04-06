const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const sequelize = require("../config/db");

// Place Order
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await Cart.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Product,
            as: "product", // ✅ MUST match the alias defined in the Cart model
            attributes: ["id", "name", "price", "imageUrl"],
          },
        ],
      });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.quantity * item.product.price;
    }, 0);

    const order = await sequelize.transaction(async (t) => {
      // Create order
      const newOrder = await Order.create(
        { userId, totalAmount },
        { transaction: t }
      );

      // Add items to OrderItem table
      for (const item of cartItems) {
        await OrderItem.create(
          {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
          { transaction: t }
        );
      }

      // Clear cart
      await Cart.destroy({ where: { userId }, transaction: t });

      return newOrder;
    });

    res.status(201).json({ message: "Order placed successfully", orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get Orders of current user
exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            include: [
              {
                model: Product,
                as: "product", // ✅ Match this with the alias from your association
                attributes: ["id", "name", "price", "imageUrl"],
              },
            ],
          },
        ],
      });
      res.json(orders);
    } catch (err) {
      console.error(err); // ✅ log error for debugging
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  };  
