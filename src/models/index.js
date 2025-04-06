const Sequelize = require("sequelize");
const sequelize = require("../config/db");

// Import models
const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// Define associations

// 🧑‍💼 User ↔ Products (Vendor)
User.hasMany(Product, { foreignKey: "vendorId", as: "products" });
Product.belongsTo(User, { foreignKey: "vendorId", as: "vendor" });

// 🛒 User ↔ Cart
User.hasMany(Cart, { foreignKey: "userId", as: "cartItems" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🛒 Product ↔ Cart
Product.hasMany(Cart, { foreignKey: "productId", as: "productCarts" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

// 📦 User ↔ Orders
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "customer" });

// 📦 Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// 📦 Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Product,
  Cart,
  Order,
  OrderItem,
};
