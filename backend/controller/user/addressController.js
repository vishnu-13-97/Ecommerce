const logger = require("../../config/logger");
const Address = require("../../models/address");
const User = require('../../models/user')

const addAddress = async (req, res) => {
  logger.info("addAddress Route Hit ...");
  try {
    const userId = req.user.id;

    const { fullName, mobile, pincode, addressLine, landmark, city, state, country, isDefault } = req.body;

    if (!fullName || !mobile || !pincode || !addressLine || !city || !state || !country) {
      logger.warn("All Details Required");
      return res.status(400).json({
        success: false,
        message: "All Details Required",
      });
    }

    // If new default, remove old default BEFORE creating new address
    if (isDefault) {
      await Address.updateMany(
        { user: userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    // Create address
    const newAddress = await Address.create({
      user: userId,
      fullName,
      mobile,
      pincode,
      addressLine,
      landmark,
      city,
      state,
      country,
      isDefault: isDefault ? true : false,
    });

    // Link address to user
    await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: newAddress._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });

  } catch (error) {
    logger.error("Address Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add address",
      error: error.message
  });
  }
};


const getAddress = async (req,res)=>{
    logger.info('getAddress route hit...')
    try {
        const userId = req.user.id;

        const address  = await Address.find({user:userId});
 
      return res.status(200).json({
      success: true,
      addresses: address || []
    });

    } catch (error) {
        logger.warn("Internal server error")
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}

const updateAddress = async (req, res) => {
  logger.info("updateAddress Route Hit...");
  try {
    const userId = req.user.id;
    const updateFields = req.body;

    const address = await Address.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!address) {
      logger.warn("Address not found for update");
      return res.status(404).json({
        success: false,
        message: "Address not found for this user",
      });
    }

    logger.info("Address updated successfully");
    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    logger.error("Update Address Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeAddress = async (req, res) => {
  logger.info("removeAddress Route Hit...");
  try {
    const userId = req.user.id;

    const address = await Address.findOneAndDelete({ user: userId });

    if (!address) {
      logger.warn("No address found to delete");
      return res.status(404).json({
        success: false,
        message: "No address found for this user",
      });
    }

    logger.info("Address removed successfully");
    res.status(200).json({
      success: true,
      message: "Address removed successfully",
    });
  } catch (error) {
    logger.error("Remove Address Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
    addAddress,
    updateAddress,
    removeAddress,
    getAddress
}