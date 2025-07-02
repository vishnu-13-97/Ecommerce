const express =require("express");
const auth = require("../middleware/jwt");
const { getAllUsers, getSingleUser, blockUser, unBlockUser } = require("../controller/admin/UserManagementController");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();





router.get('/',auth,isAdmin,getAllUsers);
router.get('/:id',auth,isAdmin,getSingleUser);
router.post('/block/:id',auth,isAdmin,blockUser);
router.post('/unblock/:id',auth,isAdmin,unBlockUser);

module.exports=router;