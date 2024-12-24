/**
 * Custom error class for HTTP parsing errors
 */
class HTTPParseError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'HTTPParseError';
    this.statusCode = statusCode;
  }
}

/**
 * Parse raw HTTP request data
 * @param {string} buff - Raw HTTP request data
 * @returns {Object} Parsed request data
 * @throws {HTTPParseError} If parsing fails
 */
function httpParser(buff) {
  try {
    const [requestLine, ...lines] = buff.split('\r\n');
    const [method, path, version] = requestLine.split(' ');
    
    // Parse headers
    const headers = {};
    let bodyStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        bodyStart = i + 1;
        break;
      }
      
      const [key, ...value] = line.split(':');
      if (key) {
        headers[key.trim().toLowerCase()] = value.join(':').trim();
      }
    }
    
    // Parse body if present
    const body = bodyStart >= 0 ? parseBody(lines.slice(bodyStart).join('\r\n')) : {};
    
    // Using object property shorthand
    const data = {
      method,
      path,
      version,
      headers,
      body
    };
    
    // Validate request data
    validateRequest(data);
    
    return data;
  } catch (error) {
    if (error instanceof HTTPParseError) {
      throw error;
    }
    throw new HTTPParseError('Failed to parse HTTP request', 400);
  }
}

/**
 * Parse HTTP request body
 * @param {string} body - Raw HTTP request body
 * @returns {Object} Parsed body data
 * @throws {HTTPParseError} If body parsing fails
 */
function parseBody(body) {
  try {
    return body ? JSON.parse(body) : {};
  } catch (error) {
    throw new HTTPParseError('Invalid JSON in request body', 400);
  }
}

/**
 * Validates HTTP request data
 * @param {Object} data - Parsed HTTP request data
 * @returns {void}
 * @throws {HTTPParseError} If validation fails
 */
function validateRequest(data) {
  if (!data.method) {
    throw new HTTPParseError('Missing HTTP method', 400);
  }

  if (!data.path) {
    throw new HTTPParseError('Missing request path', 400);
  }

  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  if (!validMethods.includes(data.method)) {
    throw new HTTPParseError(`Invalid HTTP method: ${data.method}`, 405);
  }

  if (!data.path.startsWith('/')) {
    throw new HTTPParseError('Path must start with /', 400);
  }

  if (data.path.includes('..')) {
    throw new HTTPParseError('Invalid path: potential directory traversal', 400);
  }
}

const { queryParser } = require('./utils.js');
const HTTPParseError = require('./errors.js');

/**
 * Find position of first bracket in request
 * @param {string[]} request - Array of request lines
 * @param {string} bracket - Bracket to find
 * @returns {number} Position of bracket or -1 if not found
 */
function findFirstBrac(request, bracket) {
  for (let i = 0; i < request.length; i++) {
    if (request[i].includes(bracket)) return i;
  }
  return -1;
}

/**
 * Store key-value pair in query object
 * @param {string} queryStr - Query string to parse
 * @returns {Object} Parsed query parameters
 */
function storeQuery(queryStr) {
  const queryObj = {};
  const pairs = queryStr.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      queryObj[key] = value;
    }
  }
  
  return queryObj;
}

/**
 * Parse query string from URL
 * @param {string} urlStr - URL string to parse
 * @returns {Object} Parsed query parameters
 */
function queryParser(urlStr) {
  const queryStartPos = findFirstBrac(urlStr, '?');
  if (queryStartPos === -1) return {};
  
  const queryStr = urlStr.slice(queryStartPos + 1);
  return storeQuery(queryStr);
}

module.exports = {
  httpParser,
  HTTPParseError,
  queryParser
};
