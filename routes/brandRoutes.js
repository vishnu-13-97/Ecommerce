const express = require('express');
const auth = require('../middleware/jwt');
const isAdmin = require('../middleware/isAdmin');
const { uploadBrand } = require('../config/cloudinary');
const { addBrand,getAllBrands, getSingleBrand, deleteBrand, updateBrand } = require('../controller/admin/brandController');
const router = express.Router();

router.post('/',auth,isAdmin,uploadBrand.single('image'),addBrand);
router.get('/',getAllBrands);
router.get('/:id',getSingleBrand);
router.delete('/:id',auth,isAdmin,deleteBrand);
router.put('/:id',auth,isAdmin,uploadBrand.single('image'),updateBrand);


module.exports=router;