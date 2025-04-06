const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity });
    }

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart", details: err.message });
  }
};

const getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: "product" }]
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", details: err.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cartId } = req.params;

    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem || cartItem.userId !== req.user.id)
      return res.status(404).json({ message: "Cart item not found or unauthorized" });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart", details: err.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem || cartItem.userId !== req.user.id)
      return res.status(404).json({ message: "Cart item not found or unauthorized" });

    await cartItem.destroy();
    res.status(200).json({ message: "Cart item removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove item", details: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart", details: err.message });
  }
};

module.exports = {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
