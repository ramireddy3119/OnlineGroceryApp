const Product = require("../models/Product");

// 📌 Create Product with Image Upload
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const imageUrl = req.file?.path; // cloudinary URL

    if (!imageUrl) {
      return res.status(400).json({ error: "Image is required." });
    }

    const existingProduct = await Product.findOne({
      where: {
        name,
        vendorId: req.user.id,
      },
    });

    if (existingProduct) {
      return res.status(400).json({ error: "Product with the same name already exists." });
    }
    const newProduct = await Product.create({
      name,
      price,
      stock,
      category,
      imageUrl,
      vendorId: req.user.id,         // track who uploaded
      uploaderRole: req.user.role    // 'vendor' or 'admin'
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product." });
  }
};

// 📌 Update Product (only by uploader)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!product) return res.status(404).json({ error: "Product not found." });

    const updateData = {
      ...req.body,
    };

    if (req.file?.path) {
      updateData.imageUrl = req.file.path;
    }

    await product.update(updateData);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed." });
  }
};

// 📌 Delete Product (only by uploader)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!product) return res.status(404).json({ error: "Product not found." });

    await product.destroy();
    res.json({ message: "Product deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed." });
  }
};

// 📌 Get All Products by Vendor
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { vendorId: req.user.id } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed." });
  }
};

// 📌 Get All Products (Public)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed." });
  }
};

// 📌 Admin: View All Products with Vendor Info
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: ["vendor"]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed." });
  }
};


exports.getProductBycategory = async (req,res) =>{
  try{
    const {category} = req.params;
    const products = await Product.findAll({where:{category}});
    res.json(products);
  }catch(err){
    res.status(500).json({error:"Fetch failed"});
  }
}
