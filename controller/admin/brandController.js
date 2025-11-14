const { default: slugify } = require("slugify");
const logger = require("../../config/logger");
const Brand = require("../../models/brand");
const redis = require("../../config/redis");



const addBrand=async(req,res)=>{
    logger.info("add Brand Route hit..");
try {

    
    const {name,description}=req.body;
    if(!name){
        return res.status(400).json({
            status:400,
            message:"Brand name is required"
        })

}
const existing = await Brand.findOne({ name });
   if (existing) {
    logger.warn("Brand already exist");
      return res.status(409).json({ message: "Brand already exists." });
    }

    const slug = slugify(name, { lower: true, strict: true });

     let imageData = {};
    if (req.file) {
      imageData = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    
        const brand = await Brand.create({
          name,
          slug,
          description,
          logo: imageData,
          isActive: true,
        });
    
        res.status(201).json({
          message: "Brand created successfully.",
          brand
        });
 
    
} catch (error) {
    logger.error("Internal Server Error",error);
    res.status(500).json({
        status:500,
        message:"Internal server error"
    })
    
}
   
}

const getAllBrands = async (req, res) => {
  logger.info("getAllBrands Route hit.."); 
  try {

    const cashedBrands = await redis.get('all_brands');
    const parsedData = JSON.parse(cashedBrands);
    if(cashedBrands){
      return res.status(200).json({
      success: true,
      count: parsedData.length,
      data: parsedData
    });
    }
    const brands = await Brand.find({});
    await redis.set('all_brands',JSON.stringify(brands),'EX',3600);
    logger.info('all brands fetched from db and stored to redis');
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands,
    });

  } catch (error) {
    logger.error("Error fetching brands: ", error); 
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve brands.",
    });
  }
};

const getSingleBrand = async (req, res) => {
  logger.info("getAllBrands Route hit.."); 
  try {
    const {id}=req.params;
    const brand = await Brand.findById({_id:id});
    res.status(200).json({
      success: true,
      data: brand,
    });
  } catch (error) {
    logger.error("Error fetching brand: ", error); 
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve brand.",
    });
  }
};


const deleteBrand = async (req, res) => {
  logger.info("Delete Brand route hit...");
  try {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      logger.warn(`Brand not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
await redis.del('all_brands');
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      deletedBrand: brand,
    });
  } catch (error) {
    logger.error("Error deleting brand: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting brand",
    });
  }
};


const updateBrand = async (req, res) => {
  logger.info("Update Brand route hit...");
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updateData = { name, description };

   
    if (req.file) {
      updateData.image = {
        public_id: req.file?.public_id, 
        url: req.file?.path || req.file?.url,
      };
    }

    const brand = await Brand.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true,
    });

    if (!brand) {
      logger.warn(`Brand not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
await redis.del('all_brands');
    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      updatedBrand: brand,
    });

  } catch (error) {
    logger.error("Error updating brand: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating brand",
    });
  }
};

module.exports={
    addBrand,
    getAllBrands,
    getSingleBrand,
    deleteBrand,
    updateBrand
}