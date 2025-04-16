const express = require("express");
const sequelize = require("./src/config/db");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/ProductRoutes")
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const { swaggerUi, swaggerDocs } = require("./src/config/swagger");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
// app.use("/uploads", express.static("public/uploads"));
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Sync Database & Start Server
sequelize.sync().then(() => {
  console.log("Database connected!");
  app.listen(5000, () => console.log("Server running on port 5000"));
});


