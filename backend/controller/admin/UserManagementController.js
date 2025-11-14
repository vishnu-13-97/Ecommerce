const logger = require("../../config/logger");
const User = require("../../models/user");

/**
 * Get All Users
 */
const getAllUsers = async (req, res) => {
  logger.info("getAllUsers route hit...");

  try {
    const users = await User.find({ role: "user" }).select("-password");

    if (!users || users.length === 0) {
      logger.warn("No users found in the database");
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    logger.info(`Fetched ${users.length} users from DB`);
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    logger.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

/**
 * Get Single User
 */
const getSingleUser = async (req, res) => {
  logger.info("getSingleUser route hit...");

  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, role: "user" }).select("-password");

    if (!user) {
      logger.warn(`User not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    logger.info(`Fetched user with ID: ${id}`);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error("Error fetching user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

/**
 * Block User
 */
const blockUser = async (req, res) => {
  logger.info("blockUser route hit...");

  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      logger.warn(`User with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "User is already blocked",
      });
    }

    user.isBlocked = true;
    await user.save();

    logger.info(`User ${id} blocked successfully`);
    res.status(200).json({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    logger.error("Error blocking user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while blocking user",
    });
  }
};

/**
 * Unblock User
 */
const unBlockUser = async (req, res) => {
  logger.info("unBlockUser route hit...");

  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      logger.warn(`User with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "User is not blocked",
      });
    }

    user.isBlocked = false;
    await user.save();

    logger.info(`User ${id} unblocked successfully`);
    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    logger.error("Error unblocking user:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while unblocking user",
    });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  blockUser,
  unBlockUser,
};
