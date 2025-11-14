const express = require('express');
const { isUser } = require('../../middleware/isAdmin');
const auth = require('../../middleware/jwt');
const { placeOrder, getMyOrders, cancelOrder, getSingleOrder } = require('../../controller/user/orderController');
const router = express.Router();



router.post('/',auth,isUser,placeOrder);
router.get('/',auth,isUser,getMyOrders);
router.put('/cancel-order/:id',auth,isUser,cancelOrder);
router.get('/:id',auth,isUser,getSingleOrder);
module.exports=router;

