const logger = require("../../config/logger")

const Cart = require('../../models/cart');
const Product = require('../../models/products');

const addToCart = async (req, res) => {
    logger.info("addToCart Route hit...")
  try {
    const userId = req.user.id;
    
    
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
        logger.warn('Invalid product or quantity')
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive || product.stock < quantity) {
        logger.warn('Product not available')
      return res.status(404).json({ message: 'Product not available' });
    }

    const productPrice = product.price;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity, price: productPrice }],
        totalItems: quantity,
        totalPrice: productPrice * quantity,
      });
    } else {
      // Check if product already in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex >= 0) {
        // Update quantity and price
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].price = productPrice;
      } else {
        // Add new product to cart
        cart.items.push({ product: productId, quantity, price: productPrice });
      }

      // Recalculate totals
      cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
  
  

    await cart.save();
   
    res.status(201).json({
      message: 'Product added to cart successfully',
      cart,
    });
    logger.info('Product added to cart successfully')
  } catch (err) {
    logger.error('Add to Cart Error:', err);
    res.status(500).json({ message: 'Internal server error' });
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

}