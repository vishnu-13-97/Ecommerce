const rateLimit = require('express-rate-limit');


const LoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 login/register attempts
  message: {
    error: 'Too many login attempts, please try again after 10 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 5 login/register attempts
  message: {
    error: 'Too many register attempts, please try again after 10 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  registerLimiter,
  LoginLimiter,
};
