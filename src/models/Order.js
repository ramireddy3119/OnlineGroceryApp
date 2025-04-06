const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const OrderItem = require("./OrderItem");
const Product = require("./Product");

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "shipped", "delivered"),
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

// Associations (safe to define here)
Order.belongsTo(User, { foreignKey: "userId", as: "user" });
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "orderItems" });

OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = Order;
