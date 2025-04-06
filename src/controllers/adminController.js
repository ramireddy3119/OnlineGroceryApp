const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
        where: { role: "customer" }, 
        attributes: { exclude: ["password"] } 
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if(user.role !== "customer") return res.status(404).json({ message: "User not found" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// Get all products
exports.addProduct = async (req, res) => {
    try {
      const { name, price, stock, imageUrl, description, category } = req.body;
      const product = await Product.create({ name, price, stock, imageUrl, description, category });
      res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ message: "Error adding product" });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  }catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
  };

// Update product
exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await Product.update(req.body, { where: { id } });
  
      if (!updated) return res.status(404).json({ message: "Product not found" });
  
      const updatedProduct = await Product.findByPk(id);
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: "Error updating product" });
    }
  };

  // Delete product
  exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { id } });
  
      if (!deleted) return res.status(404).json({ message: "Product not found" });
  
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product" });
    }
  };

  
  // Get all products
  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  };

  
  // Get all orders with user and order items
  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
          {
            model: OrderItem,
            as: "orderItems",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  };
  
  // Update order status
  exports.updateOrder = async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      order.status = status;
      await order.save();
      res.json({ message: "Order status updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to update order" });
    }
  };
  
  // Delete an order
  exports.deleteOrder = async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
  
      await OrderItem.destroy({ where: { orderId: order.id } });
      await order.destroy();
      res.json({ message: "Order deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete order" });
    }
  };
  

//Get Vendors list
exports.getAllVendors = async (req, res) => {
    try {
      const users = await User.findAll({
          where: { role: "vendor" }, 
          attributes: { exclude: ["password"] } 
      });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  };
