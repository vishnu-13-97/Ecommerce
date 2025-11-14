const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;
const path = require('path');

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack trace for errors
    logFormat
  ),
  transports: [
    // Save all logs
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
    }),
  ],
});

// Log to console in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat),
    })
  );
}

module.exports = logger;
