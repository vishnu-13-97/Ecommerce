const express = require('express');
const auth = require('../middleware/jwt');

const { uploadProduct } = require('../config/cloudinary');
const { addProduct, getAllProducts,getSingleProduct, updateProduct ,deleteProduct} = require('../controller/admin/ProductController');
const { isAdmin } = require('../middleware/isAdmin');
const router = express.Router();


router.post('/',auth,isAdmin,uploadProduct.array("image",5),addProduct);
router.get('/',getAllProducts);
router.get('/:id',getSingleProduct);
router.put('/:id',auth,isAdmin,uploadProduct.array("image",5),updateProduct);
router.delete('/:id',auth,isAdmin,deleteProduct);

module.exports=router;