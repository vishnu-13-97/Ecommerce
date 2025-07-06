const { default: slugify } = require("slugify");
const logger = require("../../config/logger");
const Product = require("../../models/products");


const addProduct = async(req,res)=>{
    logger.info("addProduct Route hit..")
try {
    
  const {name,description,price,stock,category,brand,isFeatured,isActive}=req.body;

    if(!name|!description|!price|!stock|!category|!brand){
        logger.warn("All fields required");
        return res.status(400).json({
            status:400,
            message:"All fields required"
        })
    }
    const existing = await Product.findOne({ name });
    if(existing){
        logger.warn("Product already exist");
           return res.status(409).json({
            status:409,
            message:"Product already exists"
        })
    }
    
        const slug = slugify(name, { lower: true, strict: true });
    
       
        let images = [];
    if (req.files && req.files.length > 0) {
      

      images = req.files.map(file => ({
        public_id: file.filename,
        url: file.path, 
      }));
    }
    
        const product = await Product.create({
          name,
          slug,
          description,
          price,
          stock,
          category,
          brand,
          images,
          isFeatured,
          isActive

        });
    
        res.status(201).json({
          message: "Product created successfully.",
          product
        });
    
} catch (error) {
    logger.error("Internal server error",error);
     res.status(500).json({status:500,
         message: "Server error." });
  
    
}
  
}


const getAllProducts = async(req,res)=>{
logger.info("GetAllProduct Route hit...");
try {
  const product = await Product.find({});
  res.status(200).json({
      success: true,
      count: product.length,
      data: product,
    });
  
} catch (error) {
  logger.error("error fetching product",error);
   res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve Products.",
    });
  
}

}


const getSingleProduct = async (req,res)=>{
  logger.info("get single product Route hit...")
  try {
    const {id}=req.params;
    const singleproduct = await Product.findById({_id:id});
    if(!singleproduct){
      logger.warn("product not found in with this id", id);
      return res.status(400).json({
        message:"Product not found"
      })
    }

    res.status(200).json({
      status:200,
      data:singleproduct
    })

  } catch (error) {
    logger.error("error fetching product",error);
   res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve Product.",
    });
  
  }
}

const updateProduct = async(req,res)=>{
  logger.info("update Product Route hit ....")
  try {
    const {id}=req.params;
    const {name,description,price,stock,category,brand,isFeatured,isActive}=req.body

    const updateData ={name,description,price,stock,category,brand,isFeatured,isActive};

    if (req.files && req.files.length > 0) {
     updateData.images = req.files.map(file => ({
        public_id: file.filename,
        url: file.path, 
      }));
    }


      const product = await Product.findByIdAndUpdate(id, updateData, {
          new: true, 
          runValidators: true,
        });

  
    if (!product) {
      logger.warn(`Product not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct: product,
    });

  } catch (error) {
    logger.error("Error updating product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }

}

const deleteProduct = async(req,res)=>{

logger.info("Delete Product Route Hit...");
try {
  const {id}=req.params;

  const product = await Product.findByIdAndDelete({_id:id});
  if(!product){
          logger.warn(`product not found with ID: ${id}`);
    return res.status(404).json({
      success:false,
      message:"product not found"
    })
  }
   res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: product,
    });
    logger.info("Product Deleted successfully")
} catch (error) {
   logger.error("Error deleting Product: ", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting Product",
      });
  
}

}

module.exports = {
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
}