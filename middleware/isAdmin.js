const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (err) {
    console.error("isAdmin middleware error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. User-only route." });
  }
};

module.exports = {isAdmin,isUser};
