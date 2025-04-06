// middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
    // Assume you set `req.user` after JWT verification
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    next();
  };
  
  exports.isVendor = (req, res, next) => {
    if (req.user.role !== "vendor") return res.status(403).json({ error: "Access denied: Vendor only" });
    next();
  };
  
  exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied: Admin only" });
    next();
  };
  
  exports.isCustomer = (req, res, next) => {
    if (req.user.role !== "customer") return res.status(403).json({ error: "Access denied: Customer only" });
    next();
  };
  