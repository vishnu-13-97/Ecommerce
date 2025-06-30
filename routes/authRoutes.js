const express = require('express');
const router = express.Router();
const validate=require('../middleware/validate');
const {loginSchema,registerSchema}=require("../validators/userValidator");
const authController = require('../controller/authController');
const {LoginLimiter,registerLimiter}=require('../config/ratelimit');
const auth = require('../middleware/jwt');
const isBlocked = require('../middleware/isBlocked');




router.post('/register',registerLimiter,validate(registerSchema),authController.register);
router.post('/login',LoginLimiter,validate(loginSchema),authController.login);
router.get('/profile',auth,isBlocked,authController.userProfile)
router.post('/logout',authController.logOut)
module.exports = router;