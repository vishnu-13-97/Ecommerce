const logger = require('../config/logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary')
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const cookieName = process.env.COOKIE_NAME || 'token';
// -------------------- REGISTER --------------------
const register = async (req, res) => {
  logger.info('register route hit ...');
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      logger.warn('User already exists and verified');
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + OTP_EXPIRY_MS;

    if (user && !user.isVerified) {
      // Update existing unverified user with new OTP
      user.otp = otp;
      user.otpExpires = otpExpires;
      user.name = name;
      user.password = password;
      await user.save();
    } else {
      // Create new user record
      user = new User({
        name,
        email,
        password,
        otp,
        otpExpires,
      });
      await user.save();
    }

    await sendMail(
      email,
      'Your OTP for Ecommerce App Registration',
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    logger.info(`OTP sent to ${email}`);
    return res.status(200).json({
      message: 'OTP sent to your email',
      email,
    });

  } catch (err) {
    logger.error('Internal server error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- VERIFY OTP --------------------
const verifyOtp = async (req, res) => {
  logger.info('verify otp route hit...');
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      logger.warn('Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.info(`User ${email} verified successfully`);
    return res.status(200).json({
      message: 'OTP verified successfully, user registered',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    logger.error('Internal server error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- FORGOT PASSWORD --------------------
const forgotPassword = async (req, res) => {
  logger.info('forgot password route hit ...');
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + OTP_EXPIRY_MS;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendMail(
      email,
      'OTP for Password Reset - Ecommerce App',
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    logger.info(`Password reset OTP sent to ${email}`);
    res.status(200).json({
      message: 'OTP sent to your email',
      email,
    });

  } catch (err) {
    logger.error('Internal server error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- RESET PASSWORD --------------------
const resetPassword = async (req, res) => {
  logger.info('reset password route hit ...');
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      logger.warn('Invalid or expired OTP');
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.info(`Password reset successful for ${email}`);
    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    logger.error('Internal server error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- LOGIN --------------------
const login = async (req, res) => {
  logger.info("Login route hit...");
  try {
    const { email, password, rememberMe } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      logger.warn("Email or password missing");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.warn(`Login failed - User not found: ${email}`);
      return res.status(400).json({ message: "User not registered" });
    }

    // 3️⃣ Check if blocked
    if (user.isBlocked) {
      logger.warn(`Login attempt by blocked user: ${email}`);
      return res.status(403).json({ message: "Your account is blocked. Contact support." });
    }

    // 4️⃣ Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Incorrect password for user: ${email}`);
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 5️⃣ Clear existing cookiea
    const cookieName = process.env.COOKIE_NAME || "token";
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "Lax",
      path: "/", 
      signed: true,
    });

    // 6️⃣ Set expiry based on "Remember Me"
    const jwtExpiry = rememberMe ? "7d" : "1d"; // token validity
    const cookieExpiry = rememberMe
      ? 7 * 24 * 60 * 60 * 1000 // 7 days
      : 24 * 60 * 60 * 1000; // 1 day

    // 7️⃣ Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: jwtExpiry,
        issuer: "yourapp.com",
        audience: user.email,
      }
    );

    // 8️⃣ Set cookie
    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"||false,
      sameSite: "Lax",
      path: "/", 
      maxAge: cookieExpiry,
      signed: true,
    });

    // 9️⃣ Success response
    logger.info(`User ${email} logged in successfully (rememberMe: ${!!rememberMe})`);
    res.status(200).json({
      message: "Successfully logged in",
      rememberMe: !!rememberMe,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
     
      },
      // Optional: uncomment if frontend needs JWT directly
      token,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- USER PROFILE --------------------
const userProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId)
      .select("-password")
      .populate({path: "addresses",
        model: "Address"});

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const defaultAddress = userData.addresses.find(addr => addr.isDefault) || null;

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        avatar: userData.avatar?.url || null,
        gender: userData.gender,
        dob: userData.dob,
        isVerified: userData.isVerified,
        addresses: userData.addresses,  // 👈 FIXED
        defaultAddress,                // 👈 optional
        hobbies: userData.hobbies || [],
        country: userData.country,
        state: userData.state,
        city: userData.city,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    });
  } catch (error) {
    console.error("User Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const updateUserProfile = async (req, res) => {
  logger.info("Update profile route hit...");

  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      logger.warn("User not found for update");
      return res.status(404).json({ message: "User not found" });
    }

   
    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (req.file) {
      try {
      
        if (user.avatar?.public_id) {
          await cloudinary.uploader.destroy(user.avatar.public_id);
        }

        
        user.avatar = {
          public_id: req.file.filename,
          url: req.file.path,
        };
      } catch (err) {
        logger.error("Image upload error", err);
        return res.status(500).json({ message: "Avatar upload failed" });
      }
    }

    await user.save();
    logger.info(`User profile updated: ${user.email}`);

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar?.url || null,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    logger.error("Profile Update Error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------- LOGOUT --------------------
const logOut = (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
  login,
  userProfile,
  updateUserProfile,
  logOut,
};
