const express = require("express");
const sequelize = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const { swaggerUi, swaggerDocs } = require("./src/config/swagger");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

// Routes
app.use("/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Sync Database & Start Server
sequelize.sync().then(() => {
  console.log("Database connected!");
  app.listen(5000, () => console.log("Server running on port 5000"));
});


