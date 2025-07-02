const express = require('express');
const auth = require('../middleware/jwt');
const { isUser } = require('../middleware/isAdmin');
const { addToWishList, removeFromWishlist, getWishList } = require('../controller/user/wishListController');
const router = express.Router();




router.post('/',auth,isUser,addToWishList);
router.delete('/',auth,isUser,removeFromWishlist);
router.get('/',auth,isUser,getWishList);

module.exports=router;
 