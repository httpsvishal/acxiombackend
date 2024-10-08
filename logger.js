const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// If we're not in production then log to the console as well
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      timestamp(),
      logFormat
    )
  }));
}

module.exports = logger;