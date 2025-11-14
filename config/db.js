const mongoose = require('mongoose');
const logger = require('./logger');

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  logger.info('Requesting DB connection...');
  try {
    const connection = await mongoose.connect(mongoURI);

    logger.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    process.exit(1); 
  }
};

module.exports = connectDB;
