const User = require('../models/user');

const isBlocked = async (req, res, next) => {
  try {
    // Double check req.user is populated by auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Invalid or missing token." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Please contact support." });
    }

    next();
  } catch (err) {
    console.error("isBlocked middleware error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = isBlocked;
