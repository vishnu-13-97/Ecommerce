const logger = require('../config/logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
    logger.info("register route hit..")
  try {
    const {name,email,password} = req.body;
    const existinguser = await User.findOne({email});
    if(existinguser){
        logger.warn("User already exist");
        return res.status(400).json({
            message:"user already exist"
        })
    }
const newuser =  new User({name,email,password});
const savedUser = await newuser.save();


    logger.info("User registered successfully");

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },

    })
    
  } catch (error) {
    logger.error("Internal Server error",error);
  res.status(500).json({
  status: 500,
  message: "Internal server error"
});

    
    
  }  
}

const login = async (req, res) => {
  logger.info("Login route hit...");

  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }).select('+password');

    if (!existingUser) {
      logger.warn("User not registered");
      return res.status(400).json({
        status: 400,
        message: "User not registered",
      });
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      logger.warn("Incorrect Password");
      return res.status(400).json({
        status: 400,
        message: "Incorrect password",
      });
    }

    if (existingUser.isBlocked) {
      logger.warn("User is blocked, contact support");
      return res.status(403).json({
        status: 403,
        message: "Your account is blocked. Please contact support.",
      });
    }

    // JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      }
    });

    logger.info(`User ${existingUser.email} logged in successfully`);

  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
};

const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).select('-password'); 

    if (!userData) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'User profile fetched successfully',
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
   
      },
    });
  } catch (error) {
    console.error('User Profile Error:', error);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
    });
  }
};

const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({ message: "Logout successful" });
};




module.exports={
    login,
    register,
    userProfile,
    logOut
}