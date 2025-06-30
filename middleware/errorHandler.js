
const logger = require("../config/logger")

module.exports = (err, req, res, next) => {
  logger.error(err); 
  res.status(500).json({ message: 'Internal Server Error' });
};