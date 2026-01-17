/**
 * Simple logging utility for Hasty Server
 * Provides structured logging with configurable levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const LOG_LEVEL_NAMES = {
  0: 'ERROR',
  1: 'WARN',
  2: 'INFO',
  3: 'DEBUG'
};

let currentLogLevel = LOG_LEVELS.INFO; // Default to INFO level
let logToConsole = true; // Default to console logging

/**
 * Set the current log level
 * @param {string} level - Log level (ERROR, WARN, INFO, DEBUG)
 */
function setLogLevel(level) {
  const upperLevel = level.toUpperCase();
  if (LOG_LEVELS[upperLevel] !== undefined) {
    currentLogLevel = LOG_LEVELS[upperLevel];
  }
}

/**
 * Enable or disable console logging
 * @param {boolean} enabled - Whether to log to console
 */
function setConsoleLogging(enabled) {
  logToConsole = enabled;
}

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level name
 * @param {string} message - Log message
 * @param {Object} [meta] - Additional metadata
 * @returns {string} Formatted log message
 */
function formatLogMessage(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
}

/**
 * Internal logging function
 * @param {number} level - Numeric log level
 * @param {string} message - Log message
 * @param {Object} [meta] - Additional metadata
 */
function log(level, message, meta = {}) {
  if (level > currentLogLevel) return;

  const levelName = LOG_LEVEL_NAMES[level];
  const formattedMessage = formatLogMessage(levelName, message, meta);

  if (logToConsole) {
    const consoleMethod = level === LOG_LEVELS.ERROR ? 'error' :
                         level === LOG_LEVELS.WARN ? 'warn' : 'log';
    console[consoleMethod](formattedMessage);
  }

  // Future: Could add file logging, external service logging, etc.
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {Object} [meta] - Additional metadata
 */
function error(message, meta = {}) {
  log(LOG_LEVELS.ERROR, message, meta);
}

/**
 * Log warning message
 * @param {string} message - Warning message
 * @param {Object} [meta] - Additional metadata
 */
function warn(message, meta = {}) {
  log(LOG_LEVELS.WARN, message, meta);
}

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} [meta] - Additional metadata
 */
function info(message, meta = {}) {
  log(LOG_LEVELS.INFO, message, meta);
}

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {Object} [meta] - Additional metadata
 */
function debug(message, meta = {}) {
  log(LOG_LEVELS.DEBUG, message, meta);
}

module.exports = {
  setLogLevel,
  setConsoleLogging,
  error,
  warn,
  info,
  debug,
  LOG_LEVELS
};
