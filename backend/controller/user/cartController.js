const logger = require("../../config/logger")

const Cart = require('../../models/cart');
const Product = require('../../models/products');

const addToCart = async (req, res) => {
  logger.info("addToCart Route hit...");
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      logger.warn("Invalid product or quantity");
      return res.status(400).json({ message: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive || product.stock < quantity) {
      logger.warn("Product not available");
      return res.status(404).json({ message: "Product not available" });
    }

    const productPrice = product.price;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: productPrice }],
        totalItems: quantity,
        totalPrice: productPrice * quantity,
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price = productPrice;
      } else {
        cart.items.push({ product: productId, quantity, price: productPrice });
      }

      cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      cart.totalPrice = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
    }

    // ✅ FIX: Decrease stock
    product.stock -= quantity;
    await product.save();

    await cart.save();

    res.status(201).json({
      message: "Product added to cart successfully",
      cart,
    });

    logger.info("Product added to cart successfully");
  } catch (err) {
    logger.error("Add to Cart Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Merge localStorage cart into the logged-in user's cart
const mergeCart = async (req, res) => {
  logger.info("mergeCart Route hit...");

  try {
    const userId = req.user.id;
    const { items: localItems } = req.body; // expect: [{ product, quantity, price }, ...]

    // If nothing to merge, just return
    if (!Array.isArray(localItems) || localItems.length === 0) {
      return res.status(200).json({
        message: "No local cart items to merge",
      });
    }

    // Find existing cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a brand new cart from the local items
      cart = new Cart({
        user: userId,
        items: localItems,
        totalItems: localItems.reduce((acc, it) => acc + it.quantity, 0),
        totalPrice: localItems.reduce(
          (acc, it) => acc + it.price * it.quantity,
          0
        ),
      });

      await cart.save();
      logger.info("Created new cart from local storage items");
      return res.status(200).json({
        message: "Cart merged successfully",
        cart,
      });
    }

    // Cart exists → merge items
    localItems.forEach((localItem) => {
      const idx = cart.items.findIndex(
        (it) => it.product.toString() === localItem.product
      );

      if (idx >= 0) {
        // Increase quantity if item already exists
        cart.items[idx].quantity += localItem.quantity;
      } else {
        // Otherwise add new item
        cart.items.push(localItem);
      }
    });

    // Recalculate totals
    cart.totalItems = cart.items.reduce((acc, it) => acc + it.quantity, 0);
    cart.totalPrice = cart.items.reduce(
      (acc, it) => acc + it.price * it.quantity,
      0
    );

    await cart.save();
    logger.info("Merged local cart into existing cart");

    return res.status(200).json({
      message: "Cart merged successfully",
      cart,
    });
  } catch (error) {
    logger.error("Merge Cart Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const removeFromCart = async(req,res)=>{
  logger.info("removefromCart route hit ....")
   try {
    const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;
   if (!productId || quantity <= 0) {
        logger.warn('Invalid product or quantity')
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);

        if (!product) {
      logger.warn("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      logger.warn("Cart not found");
      return res.status(404).json({ message: "Cart not found" });
    }

       const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      logger.warn("Product not found in cart");
      return res.status(404).json({ message: "Product not found in cart" });
    }

    
    const cartItem = cart.items[itemIndex];

    if (quantity >= cartItem.quantity) {
      // Remove item completely
      cart.items.splice(itemIndex, 1);
    } else {
      // Reduce quantity
      cart.items[itemIndex].quantity -= quantity;
    }

      cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.quantity * item.price, 0);

  


    await cart.save();

   logger.info(`Removed product ${productId} (qty: ${quantity}) from cart of user ${userId}`);

    return res.status(200).json({
      message: "Product removed from cart successfully",
      cart
    });

 
} catch (error) {
     logger.error("Remove from Cart Error:", error);
    return res.status(500).json({ message: "Internal server error" });
   }


}

const viewCart = async(req,res)=>{
  logger.info("view Cart route hit...");
  try {
  const userId = req.user.id;
 const cart = await Cart.findOne({user:userId}).populate("items.product");
   if(!cart){
    return res.status(400).json({
      success:false,
      message:"cart not found"
    })
  };

  res.status(200).json({
    success:true,
    count:cart.items.length,
    data:cart
  })


  } catch (error) {
    logger.error("invalid cart ")
    res.status(500).json({
      success:false,
      message:"Server error"
    })
    
  }
}




module.exports = {
    addToCart,
    removeFromCart,
    viewCart,
mergeCart
}