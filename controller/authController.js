const {v4:uuidv4} =require('uuid') 
const logger = require('../config/logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail');
const redis = require('../config/redis');


const OTP_EXPIRY = 10 * 60; // 10 minutes

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const register = async (req, res) => {
  logger.info('register route hit ...')
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn('User already exist');
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const sessionId = uuidv4();

    // Store user data and OTP in Redis with sessionId
    await redis.set(
      `otpSession:${sessionId}`,
      JSON.stringify({ name, email, password, otp }),
      'EX',
      OTP_EXPIRY
    );

    // Send OTP email
    await sendMail(
      email,
      "Your OTP for Ecommerce App Registration",
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    return res.status(200).json({
      message: "OTP sent to your email",
      sessionId, 
    });

  } catch (err) {
          logger.warn('Internal server error',err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const verifyOtp = async (req, res) => {
        logger.info('verify otp route hit...');
  try {
    const { sessionId, otp } = req.body;

    const sessionData = await redis.get(`otpSession:${sessionId}`);
    if (!sessionData) {
            logger.warn('session expired or invalid');
      return res.status(400).json({ message: "Session expired or invalid" });
    }

    const { name, email, password, otp: storedOtp } = JSON.parse(sessionData);
    if (otp !== storedOtp) {
            logger.warn("Invalid otp");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = new User({ name, email, password });
    const savedUser = await user.save();

    await redis.del(`otpSession:${sessionId}`);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      }
    });

  } catch (err) {
          logger.warn('Internal server error',err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



const forgotPassword = async (req, res) => {
        logger.info('forgot Password route hit ...');
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
            logger.warn('User already exist');
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const sessionId = uuidv4();

    await redis.set(
      `resetSession:${sessionId}`,
      JSON.stringify({ email, otp }),
      'EX',
      OTP_EXPIRY
    );

    await sendMail(
      email,
      "OTP for Password Reset - Ecommerce App",
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    res.status(200).json({
      message: "OTP sent to your email",
      sessionId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


const resetPassword = async (req, res) => {
        logger.info('resetpassword route hit ...');
  try {
    const { sessionId, otp, newPassword } = req.body;

    const sessionData = await redis.get(`resetSession:${sessionId}`);
    if (!sessionData) {
      logger.warn('session expired or invalid')
      return res.status(400).json({ message: "Session expired or invalid" });
    }

    const { email, otp: storedOtp } = JSON.parse(sessionData);

    if (otp !== storedOtp) {
            logger.warn('Invalid Otp');
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
            logger.warn('User not found');
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();
    await redis.del(`resetSession:${sessionId}`);

    res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
       logger.warn('internal server error');
    res.status(500).json({ message: "Internal server error" });
  }
};


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
    logOut,
    verifyOtp,
    forgotPassword,
    resetPassword
}