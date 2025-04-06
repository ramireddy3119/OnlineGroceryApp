const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User"); // Import User model for association

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  }
});

// Define association
Product.belongsTo(User, {
  foreignKey: "vendorId",
  as: "vendor",
});

module.exports = Product;
