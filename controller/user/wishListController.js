const { default: mongoose } = require("mongoose");
const logger = require("../../config/logger");
const Product = require("../../models/products");
const Wishlist = require("../../models/wishlist");

const addToWishList = async (req, res) => {
  logger.info("addToWishList Route hit ...");
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      logger.warn("Invalid product");
      return res.status(400).json({
        success: false,
        message: "Invalid product",
      });
    }
    
const objectIdProduct = new mongoose.Types.ObjectId(productId);

    // Optional: Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      logger.warn("Product not found");
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
  wishlist = new Wishlist({
    user: userId,
    products: [{ product: objectIdProduct }],
  });
} else {
  const alreadyInWishlist = wishlist.products.some(
    (item) => item.product.toString() === objectIdProduct.toString()
  );

  if (alreadyInWishlist) {
    return res.status(409).json({
      success: false,
      message: "Product already in wishlist",
    });
  }

  wishlist.products.push({ product: objectIdProduct });
}


    await wishlist.save();

    logger.info("Wishlist updated successfully");
    res.status(201).json({
      success: true,
      message: "Product added to wishlist successfully",
      wishlist,
    });

  } catch (error) {
    logger.error("Wishlist Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const removeFromWishlist = async (req, res) => {
  logger.info("removeFromWishlist route hit...");

  try {
    const userId = req.user.id; // Assuming you're using auth middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found",
      });
    }

    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });

  } catch (error) {
    logger.error("Error removing from wishlist:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getWishList = async (req,res)=>{
    logger.info("getWishList route Hit ...");
 try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products.product");
   console.log(wishlist);
   
   if(!wishlist){
    logger.warn("wishlist not found");
    return res.status(400).json({
      success:false,
      message:"WishList not found"
    })
   }

   res.status(200).json({
    success:200,
    count:wishlist.products.length,
    data:wishlist.products
   })

 } catch (error) {
     logger.error("Internal server error ")
    res.status(500).json({
      success:false,
      message:"Server error"
    })
    
 }
}

module.exports = {
  addToWishList,
  removeFromWishlist,
  getWishList
};
