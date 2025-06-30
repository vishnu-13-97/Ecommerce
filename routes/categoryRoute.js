const express = require("express");
const auth = require("../middleware/jwt");
const isAdmin = require("../middleware/isAdmin");
const { addCategory,getAllCategory,getSingleCategory, deleteCategory, updatecategory } = require("../controller/admin/CategoryController");
const { uploadCategory } = require("../config/cloudinary");
const router = express.Router();

router.post("/",auth,isAdmin,uploadCategory.single('image'),addCategory);
router.get('/',getAllCategory);
router.get("/:id",getSingleCategory);
router.put('/:id',auth,isAdmin,uploadCategory.single("image"),updatecategory);
router.delete('/:id',auth,isAdmin,deleteCategory)

module.exports=router;