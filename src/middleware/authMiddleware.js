const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ JWT Verification Middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("Authorization Header:", authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    console.log("User from token:", req.user);
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: error.message });
  }
};

// ✅ Specific Role Guards
function isVendor(req, res, next) {
  if (!req.user || req.user.role !== "vendor") {
    return res.status(403).json({ error: "Access denied: Vendor only" });
  }
  next();
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admin only" });
  }
  next();
}

function isCustomer(req, res, next) {
  if (req.user.role !== "customer") {
    return res.status(403).json({ error: "Access denied: Customer only" });
  }
  next();
}

// ✅ Unified Role Authorization Middleware
function authorizeRole(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: Insufficient role" });
    }
    next();
  };
}

// ✅ Clean consistent export
module.exports = authMiddleware;
module.exports.isVendor = isVendor;
module.exports.isAdmin = isAdmin;
module.exports.isCustomer = isCustomer;
module.exports.authorizeRole = authorizeRole;
