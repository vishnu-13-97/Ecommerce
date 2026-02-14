const logger = require("../../config/logger");
const Cart = require("../../models/cart");
const Product = require("../../models/products");

/**
 * @desc    Add product to cart
 * @route   POST /user/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  logger.info("addToCart route hit...");

  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    // 🆕 If cart does not exist
    if (!cart) {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Not enough stock available",
        });
      }

      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
        totalItems: quantity,
        totalPrice: product.price * quantity,
      });

    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;

        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Stock limit exceeded",
          });
        }

        cart.items[itemIndex].quantity = newQuantity;
        cart.items[itemIndex].price = product.price;

      } else {
        if (product.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: "Not enough stock available",
          });
        }

        cart.items.push({
          product: productId,
          quantity,
          price: product.price,
        });
      }

      // 🔄 Recalculate totals
      cart.totalItems = cart.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    await cart.save();

    logger.info("Product added to cart successfully");

    return res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });

  } catch (error) {
    logger.error("Add to Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



/**
 * @desc    Remove product from cart
 * @route   DELETE /user/cart
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  logger.info("removeFromCart route hit...");

  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    const cartItem = cart.items[itemIndex];

    if (quantity >= cartItem.quantity) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= quantity;
    }

    // 🧹 If cart empty → delete it
    if (cart.items.length === 0) {
      await Cart.deleteOne({ user: userId });
      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
        cart: null,
      });
    }

    // 🔄 Recalculate totals
    cart.totalItems = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    logger.info("Product removed from cart successfully");

    return res.status(200).json({
      success: true,
      message: "Product removed successfully",
      cart,
    });

  } catch (error) {
    logger.error("Remove from Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



/**
 * @desc    View Cart
 * @route   GET /user/cart
 * @access  Private
 */
const viewCart = async (req, res) => {
  logger.info("viewCart route hit...");

  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        count: 0,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      count: cart.items.length,
      data: cart,
    });

  } catch (error) {
    logger.error("View Cart Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  addToCart,
  removeFromCart,
  viewCart,
};
