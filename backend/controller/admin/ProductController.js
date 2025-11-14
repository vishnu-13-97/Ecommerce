const { default: slugify } = require("slugify");
const logger = require("../../config/logger");
const Product = require("../../models/products");

/**
 * Add Product
 */
const addProduct = async (req, res) => {
  logger.info("addProduct Route hit...");

  try {
    const { name, type ,description, price, stock, category, brand, isFeatured, isActive } = req.body;

    // Validation
    if (!name ||!type || !description || !price || !stock || !category || !brand) {
      logger.warn("All fields are required");
      return res.status(400).json({
        status: 400,
        message: "All fields are required",
      });
    }

    // Check if product exists
    const existing = await Product.findOne({ name });
    if (existing) {
      logger.warn("Product already exists");
      return res.status(409).json({
        status: 409,
        message: "Product already exists",
      });
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Handle uploaded images (if any)
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    // Create product
    const product = await Product.create({
      name,
      type,
      slug,
      description,
      price,
      stock,
      category,
      brand,
      images,
      isFeatured,
      isActive,
    });

    logger.info("Product created successfully");
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    logger.error("Internal server error", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};

/**
 * Get All Products
 */
const getAllProducts = async (req, res) => {
  logger.info("getAllProducts Route hit...");

  try {
    const products = await Product.find({})
      .populate("category", "name")
      .populate("brand", "name");

    logger.info(`Fetched ${products.length} products from DB`);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    logger.error("Error fetching products", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

/**
 * Get Single Product
 */
const getSingleProduct = async (req, res) => {
  logger.info("getSingleProduct Route hit...");

  try {
    const { id } = req.params;

    // populate category and brand
    const product = await Product.findById(id)
      .populate("category", "name") // only bring 'name' field
      .populate("brand", "name");   // only bring 'name' field

    if (!product) {
      logger.warn(`Product not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error("Error fetching single product", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving product",
    });
  }
};


/**
 * Update Product
 */
const updateProduct = async (req, res) => {
  logger.info("updateProduct Route hit...");

  try {
    const { id } = req.params;
    const { name,type, description, price, stock, category, brand, isFeatured, isActive } = req.body;

    const updateData = { name, type,description, price, stock, category, brand, isFeatured, isActive };

      
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined || updateData[key] === "" ? delete updateData[key] : {}
    );

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => ({
        public_id: file.filename,
        url: file.path,
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      logger.warn(`Product not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    logger.info("Product updated successfully");
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    logger.error("Error updating product", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};

/**
 * Delete Product
 */
const deleteProduct = async (req, res) => {
  logger.info("deleteProduct Route hit...");

  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      logger.warn(`Product not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    logger.info("Product deleted successfully");
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    logger.error("Error deleting product", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
