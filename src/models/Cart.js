const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
    },
  },
});

// Associations
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = Cart;
