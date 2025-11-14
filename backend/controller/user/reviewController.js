const logger = require("../../config/logger");
const Product = require("../../models/products");
const Review = require("../../models/review");

/**
 * Add a Review
 */
const addReview = async (req, res) => {
  logger.info("addReview route hit...");

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

    logger.info(`Review added successfully for product: ${productId}`);
    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Error adding review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding review",
    });
  }
};

/**
 * Delete a Review
 */
const deleteReview = async (req, res) => {
  logger.info("deleteReview route hit...");

  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const deletedReview = await Review.findOneAndDelete({ user: userId, product: productId });

    if (!deletedReview) {
      logger.warn("Review not found for deletion");
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    logger.info(`Review deleted successfully for product: ${productId}`);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      deletedReview,
    });
  } catch (error) {
    logger.error("Error deleting review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting review",
    });
  }
};

/**
 * Get a Review for a Specific Product by the Logged-in User
 */
const getProductReview = async (req, res) => {
  logger.info("getProductReview route hit...");

  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const review = await Review.findOne({ user: userId, product: productId });

    if (!review) {
      logger.warn(`No review found for product: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Error fetching review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching review",
    });
  }
};

/**
 * Update a Review
 */
const updateReview = async (req, res) => {
  logger.info("updateReview route hit...");

  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const review = await Review.findOne({ user: userId, product: productId });

    if (!review) {
      logger.warn(`Review not found for product: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    logger.info(`Review updated successfully for product: ${productId}`);
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    logger.error("Error updating review:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while updating review",
    });
  }
};

/**
 * Get All Reviews (Admin)
 */
const getAllReviews = async (req, res) => {
  logger.info("getAllReviews route hit...");

  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("product", "name");

    if (!reviews || reviews.length === 0) {
      logger.warn("No reviews found in database");
      return res.status(404).json({
        success: false,
        message: "No reviews found",
      });
    }

    logger.info(`Fetched ${reviews.length} reviews from database`);
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    logger.error("Error fetching all reviews:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching reviews",
    });
  }
};

module.exports = {
  addReview,
  deleteReview,
  getProductReview,
  updateReview,
  getAllReviews,
};
