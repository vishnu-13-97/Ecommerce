const express =require("express");
const auth = require("../middleware/jwt");
const { getUserProfile, updateProfile } = require("../controller/user/profileController");
const { uploadAvatar } = require("../config/cloudinary");
const router = express.Router();

router.get("/",auth,getUserProfile);
router.put('/',auth,uploadAvatar.single("avatar"),updateProfile);

module.exports = router;