
const logger = require("../.././config/logger");
const redis = require("../../config/redis");
const User = require("../../models/user");

const getAllUsers = async(req,res)=>{
    logger.info("getAllUsers route hit...");

    try {
        
      const cashedUsers = await redis.get('all_users');
      const parsedUsers = JSON.parse(cashedUsers);
      if(cashedUsers){
        return res.status(200).json({
      success: true,
      count: parsedUsers.length,
      data: parsedUsers,
    });
      }
 const user = await User.find({role:"user"}).select("-password");
 await redis.set('all_users',JSON.stringify(cashedUsers),'EX',3600);

 logger.info('data fetched from db and stored in redis');
 

    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });

    } catch (error) {
    logger.error("Error fetching users: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
    }
    

}

const getSingleUser = async(req,res)=>{
    logger.info("getSingleUser route hit...");
    try {

        const {id} = req.params
        const user = await User.findOne({_id:id,role:"user"}).select("-password");
        if(!user){
            logger.warn("Unable to find user");
            return res.status(404).json({
                success:false,
                message:"Unable to find user"
            })
        }
        
        res.status(200).json({
            success:true,
           user
        })
        
    } catch (error) {
         logger.error("Error fetching users: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
        
    }
}


const blockUser=async (req,res)=>{
 logger.info("Block user route hit ....");
 try {
    const {id} = req.params;

    const user = await User.findById(id);
    
if (!user) {
      logger.warn(`User with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
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
    
    logger.error("Error blocking user: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while blocking user",
    });
 }
}

const unBlockUser=async (req,res)=>{
 logger.info("Block user route hit ....");
 try {
    const {id} = req.params;

    const user = await User.findById(id);
    
if (!user) {
      logger.warn(`User with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;
    await user.save();

     logger.info(`User ${id} Unblocked successfully`);
    res.status(200).json({
      success: true,
      message: "User Unblocked successfully",
    });
 } catch (error) {
    
    logger.error("Error Unblocking user: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while Unblocking user",
    });
 }
}



module.exports = {
    getAllUsers,
    getSingleUser,
    blockUser,
    unBlockUser
}