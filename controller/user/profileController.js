const User = require('../../models/user');
const { profileUpdateSchema } = require('../../validators/userValidator');
const logger = require('.././../config/logger');
const {cloudinary}=require('.././../config/cloudinary')

const getUserProfile =async (req,res)=>{
    logger.info("userProfile route Hit...");
    try {
        
        const user = await User.findById(req.user.id).select("-password");

        res.status(200).json({
            success:true,
             data:user
        })

    } catch (error) {
        logger.error("Unable to Fetch userProfile",error);
        res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
    
}

const updateProfile = async (req, res) => {
  logger.info("updateProfile Route hit...");

  try {
 
    const { error, value } = profileUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    const updateData = { ...value };


    if (req.file) {
   
      if (user.avatar?.public_id) {
        try {
          await cloudinary.uploader.destroy(user.avatar.public_id);
        } catch (cloudErr) {
          logger.warn(`Failed to delete old avatar: ${cloudErr.message}`);
        }
      }

     
      updateData.avatar = {
        public_id: req.file.filename, 
        url: req.file.path,
      };
    }

  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    logger.info("Profile updated successfully");
    res.status(200).json({
      message: "Profile updated",
      user: updatedUser,
    });

  } catch (err) {
    logger.error("Update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports ={
    getUserProfile,
    updateProfile
}