import { createLogger, transports, format } from 'winston';

// Log configuration
const logger = createLogger({
  transports: [
    // Error log to file
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // Combined logs to file
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(format.timestamp(), format.json()),
    }),

    new transports.File({
      filename: 'logs/keyUsed.log',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // Console logs
    new transports.Console({
      level: 'info',
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

/**
 * Logs an info message.
 * @param {string} message - The message to log.
 */
export const logInfo = (message) => {
  logger.info(message);
};

/**
 * Logs an error message.
 * @param {string} message - The message to log.
 */
export const logError = (message) => {
  logger.error(message);
};

export const logKey = (message) => {
  logger.info(message);
}

/**
 * Logs a warning message.
 * @param {string} message - The message to log.
 */
export const logWarn = (message) => {
  logger.warn(message);
};

/**
 * Logs a debug message.
 * @param {string} message - The message to log.
 */
export const logDebug = (message) => {
  logger.debug(message);
};
