const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const qtyToAdd = quantity || 1;

    if (qtyToAdd <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cartItem = await Cart.findOne({ where: { userId, productId } });

    if (cartItem) {
      cartItem.quantity += qtyToAdd;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ userId, productId, quantity: qtyToAdd });
    }

    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart", details: err.message });
  }
};

// const getUserCart = async (req, res) => {
//   try {
//     const cartItems = await Cart.findAll({
//       where: { userId: req.user.id },
//       include: [{ model: Product, as: "product" }],
//     });

//     res.status(200).json(cartItems);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch cart", details: err.message });
//   }
// };

const getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'quantity'], // Only include necessary cart fields
      include: [
        {
          model: Product,
          as: "product",
          attributes: ['id', 'name', 'price', 'imageUrl'], // Only include required product fields
        }
      ]
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart", details: err.message });
  }
};


// const updateCartItem = async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const { cartId } = req.params;

//     if (!quantity || quantity <= 0) {
//       return res.status(400).json({ error: "Quantity must be greater than 0" });
//     }

//     const cartItem = await Cart.findByPk(cartId);
//     if (!cartItem || cartItem.userId !== req.user.id) {
//       return res.status(404).json({ message: "Cart item not found or unauthorized" });
//     }

//     cartItem.quantity = quantity;
//     await cartItem.save();

//     res.status(200).json(cartItem);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update cart", details: err.message });
//   }
// };

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cartId } = req.params;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    const cartItem = await Cart.findByPk(cartId, {
      include: [{ model: Product, as: "product" }]
    });

    if (!cartItem || cartItem.userId !== req.user.id) {
      return res.status(404).json({ message: "Cart item not found or unauthorized" });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    // Prepare the response data
    const updatedCartItem = {
      id: cartItem.id,
      quantity: cartItem.quantity,
      product: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        price: cartItem.product.price,
        imageUrl: cartItem.product.imageUrl
      }
    };

    res.status(200).json(updatedCartItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cart", details: err.message });
  }
};


const removeCartItem = async (req, res) => {
  try {
    const { cartId } = req.params; // Get the cartId of the item to remove
    const cartItem = await Cart.findByPk(cartId);
    if (!cartItem || cartItem.userId !== req.user.id)
      return res.status(404).json({ message: "Cart item not found or unauthorized" });

    // If the quantity is zero, remove the cart item
      await cartItem.destroy();

    res.status(200).json({ message: "Cart item removed successfully" });
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
