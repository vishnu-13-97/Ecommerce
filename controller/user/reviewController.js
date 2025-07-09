const logger = require("../../config/logger");
const redis = require("../../config/redis");
const Product = require("../../models/products");
const Review = require("../../models/review");




const addaReview =async(req,res)=>{
 logger.info("addReview Routes hit...");
 try {
    const userId = req.user._id; 
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      logger.warn("Invalid product ID");
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
      isApproved: true, 
    });

    
    await review.save();

    logger.info("Review added successfully");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });

    
 

 } catch (error) {

    logger.error("Error adding review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    
 }
}


const deleteReview = async(req,res)=>{
    logger.info('deleteReview Route Hit...')
    try {
        const userId = req.user._id;
        const productId = req.params.id;

        const deleteReview = await Review.findOneAndDelete({user:userId,product:productId});

        if(!deleteReview){
            logger.warn("Unable to delete Review..");

            return res.status(400).json({
                success:false,
                message:"unable to delete review"
            })
        }

        res.status(200).json({
            success:true,
            message:"Review deleted successfully",
            Deleted_Review:deleteReview 
        })
        
    } catch (error) {
         logger.error("Error deleting review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    }
}


const getaProductReview = async(req,res)=>{
    logger.info("getaPRoductReview route hit...");
    try {
        const userId =req.user._id;
        const productId = req.params.id;

        const getReview = await Review.findOne({user:userId,product:productId});

        if(!getReview){
             logger.warn("Unable to fetch Review..");

            return res.status(400).json({
                success:false,
                message:"unable to Fetch review"
            })
        }


  res.status(200).json({
            success:true,
            message:"Review fetched  successfully",
            Review:getReview 
        })

    } catch (error) {
         logger.error("Error adding review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    }); 
    }
}

const updateReview = async (req, res) => {
  logger.info("updateReview Route hit...");
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ user: userId, product: productId });

    if (!review) {
      logger.warn("Review not found for update");
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    logger.info("Review updated successfully");
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });

  } catch (error) {
    logger.error("Error updating review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllReview = async(req,res)=>{
    logger.info("getAllreview Route hit...");
    try {

      const cashedReview = await redis.get('all_reviews');
      const parsedReview = JSON.parse(cashedReview);

      if(cashedReview){
        return  res.status(200).json({
        success:true,
        message:"review fetched successfully",
        reviews:parsedReview
       }) 
      }
        const review = await Review.find({});

        if(!review){
             logger.warn("Unable to get reviews");
      return res.status(404).json({
        success: false,
        message: "Reviewsnot found",
      });
        }

        await redis.set('all_reviews',JSON.stringify(review),'EX',3600);
        logger.info("data fetched from db and stored in redis");
       res.status(200).json({
        success:true,
        message:"review fetched successfully",
        reviews:review
       }) 
    } catch (error) {
          logger.error("Error updating review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
    }
}

module.exports = {
    addaReview,
    deleteReview,
    getaProductReview,
    updateReview,
    getAllReview

};