// controllers/productController.js
const  Product  = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, imageUrl, category } = req.body;
    const newProduct = await Product.create({
      name, price, stock, imageUrl, category,
      vendorId: req.user.id,
    });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product." });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!product) return res.status(404).json({ error: "Product not found." });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Update failed." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!product) return res.status(404).json({ error: "Product not found." });
    await product.destroy();
    res.json({ message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ error: "Delete failed." });
  }
};

exports.getVendorProducts = async (req, res) => {
  const products = await Product.findAll({ where: { vendorId: req.user.id } });
  res.json(products);
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

exports.getAllProductsAdmin = async (req, res) => {
  const products = await Product.findAll({ include: ["vendor"] });
  res.json(products);
};
