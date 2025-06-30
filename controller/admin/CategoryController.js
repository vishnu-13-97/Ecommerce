const Category = require("../../models/category");
const logger = require('../../config/logger');
const { default: slugify } = require("slugify");

const addCategory = async (req, res) => {
logger.info("add Category route hit..")
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category already exists." });
    }

    const slug = slugify(name, { lower: true, strict: true });

   
    let imageData = {};
    if (req.file) {
      imageData = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imageData,
      isActive: true,
    });

    res.status(201).json({
      message: "Category created successfully.",
      category,
    });

  } catch (error) {
    logger.error("internal server error",error)
    res.status(500).json({ message: "Server error." });
  }
};


const getAllCategory = async(req,res)=>{
  logger.info("Get Category Routes hit ...");
  try {
    const category = await Category.find({});
  res.status(200).json({
      success: true,
      count: category.length,
      data: category,
    });
  } catch (error) {
    logger.error("Error fetching categories: ", error); 
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve categories.",
    });
  }
}

const getSingleCategory = async(req,res)=>{
  logger.info('Get Single Category Routes hit ....');
  try {
    const {id}=req.params;
    const category = await Category.findById({_id:id});

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    logger.error("Error fetching category: ", error); 
    res.status(500).json({
      success: false,
      message: "Server Error. Could not retrieve category.",
    });
  }
}


const updatecategory = async (req, res) => {
  logger.info("Update category route hit...");
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

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true, 
      runValidators: true,
    });

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      updatedCategory: category,
    });

  } catch (error) {
    logger.error("Error updating category: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating category",
    });
  }
};

const deleteCategory = async (req, res) => {
  logger.info("Delete category route hit...");
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      logger.warn(`Category not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      deletedCategory: category,
    });
  } catch (error) {
    logger.error("Error deleting brand: ", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting brand",
    });
  }
};




module.exports = { addCategory ,getAllCategory,getSingleCategory,updatecategory,deleteCategory};
