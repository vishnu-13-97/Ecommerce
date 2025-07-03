const express = require('express');
const { isUser } = require('../middleware/isAdmin');
const auth = require('../middleware/jwt');
const { placeOrder } = require('../controller/user/orderController');
const router = express.Router();



router.post('/',auth,isUser,placeOrder);
module.exports=router;