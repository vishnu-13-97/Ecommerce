const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Check for signed cookie first
  const cookieToken = req.signedCookies?.token || req.cookies?.token;
  const headerToken = req.headers.authorization?.split(" ")[1];

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated User:", req.user);
    console.log("Cookies:", req.cookies);
console.log("Signed Cookies:", req.signedCookies);
console.log("Auth Header:", req.headers.authorization);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = auth;
