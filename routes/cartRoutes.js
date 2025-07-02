const express = require('express');
const auth = require('../middleware/jwt');
const { isUser } = require('../middleware/isAdmin');
const { addToCart, removeFromCart, viewCart } = require('../controller/user/cartController');
const router = express.Router();



router.post('/',auth,isUser,addToCart);
router.delete('/',auth,isUser,removeFromCart);
router.get('/',auth,isUser,viewCart)


module.exports = router;