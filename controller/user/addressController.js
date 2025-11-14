const logger = require("../../config/logger");
const Address = require("../../models/address");


const addAddress = async(req,res)=>{
    logger.info("addAddress Route Hit ...");
    try {
        const userId  = req.user.id;
     
     const {fullName,mobile,pincode,addressLine,landmark,city,state}=req.body;

if(!fullName||!mobile||!pincode||!addressLine||!landmark||!city||!state){
    logger.warn("All Details Required");
    return res.status(400).json({
        success:false,
        message:"All Details Required"
    })
}

let address = await Address.findOne({user:userId});
if(!address){
    address= new Address({
        user:userId,
        fullName,
        mobile,
        pincode,
        addressLine,
        landmark,
        city,
        state
    });
}

    await address.save();

    logger.info("Address Added successfully");
    res.status(201).json({
      success: true,
      message: "Address added  successfully",
      address,
    });
        
    } catch (error) {

         logger.error("Address Error:", error);
    res.status(500).json({ message: "Internal server error" });
    }
}


const getAddress = async (req,res)=>{
    logger.info('getAddress route hit...')
    try {
        const userId = req.user.id;

        const address  = await Address.findOne({user:userId});
        
         if(!address){
            logger.warn("Address not exist");
            res.status(400).json({
                success:false,
                message:"Adress not exist"
            })
        }

        res.status(200).json({
            success:true,
            address
        })

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