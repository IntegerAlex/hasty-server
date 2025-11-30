const { findFirstBrac, HTTPbody, JSONbodyParser, queryParser } = require('./utils.js')

/**
 * @typedef {Object} ParsedRequest
 * @property {string} method - HTTP method (e.g., 'GET', 'POST')
 * @property {string} path - Request path without query string
 * @property {string} version - HTTP version (e.g., 'HTTP/1.1')
 * @property {Object.<string, string>} headers - Lowercase header keys with their values
 * @property {Object.<string, string|string[]>} query - Parsed query parameters
 * @property {Object|string|Buffer} [body] - Parsed request body
 * @property {string} ip - Client IP address
 * @property {Object} [cors] - CORS related information (for OPTIONS requests)
 * @property {string} [cors.origin] - Origin header from CORS preflight
 * @property {string} [cors.method] - Requested method from CORS preflight
 * @property {string} [cors.headers] - Requested headers from CORS preflight
 */

/**
 * Parses an HTTP request from raw data
 * @param {string|Buffer} request - Raw HTTP request data
 * @param {Object} [connection={}] - Connection information (e.g., remoteAddress)
 * @param {string} [connection.remoteAddress] - Client IP address
 * @returns {Promise<ParsedRequest>} Parsed HTTP request object
 * @throws {Error} If the request is malformed
 */
async function httpParser(request, connection = {}) {
  try {
    /** @type {ParsedRequest} */
    const req = {
      method: 'GET',
      path: '/',
      version: 'HTTP/1.1',
      headers: {},
      query: {},
      ip: '127.0.0.1',
      body: undefined
    };

    // Convert buffer to string if necessary and handle empty requests
    const requestString = (request && request.toString) ? request.toString() : '';

    // Set client IP address with fallback
    if (connection && connection.remoteAddress) {
      req.ip = connection.remoteAddress;
    }

    // Step 1: Split the request into headers and body by finding "\r\n\r\n"
    // Split into headers and body parts
    const headerBodySplit = requestString.split('\r\n\r\n');
    if (headerBodySplit.length === 0 || !headerBodySplit[0]) {
      throw new Error('Invalid HTTP request: Missing headers');
    }

    const headersPart = headerBodySplit[0] // First part is the headers
    const bodyPart = headerBodySplit[1] || '' // Second part is the body, default to empty string if no body

    // Step 2: Extract the headers (the first line is the request line, e.g., "POST /path HTTP/1.1")
    // Split headers into lines, handling both CRLF and LF line endings
    const headers = headersPart.split(/\r?\n/).filter(line => line.trim());

    // Parse the request line (first line of the headers)
    const requestLine = (headers[0] || '').split(/\s+/);
    if (requestLine.length < 3 || !requestLine[0] || !requestLine[1] || !requestLine[2]) {
      throw new Error('Invalid request line format');
    }

    // Parse method, path, and version with validation
    const method = requestLine[0].toUpperCase();
    const path = requestLine[1] || '/';
    const version = requestLine[2];

    // Validate HTTP method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!validMethods.includes(method)) {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }

    // Validate HTTP version
    if (!/^HTTP\/\d+\.\d+$/.test(version)) {
      throw new Error(`Invalid HTTP version: ${version}`);
    }

    req.method = method;
    req.path = path;
    req.version = version;

    // Parse headers with validation
    for (let i = 1; i < headers.length; i++) {
      const line = (headers[i] || '').trim();
      if (!line) continue;

      const colonIndex = line.indexOf(':');
      if (colonIndex <= 0) continue; // Skip malformed headers

      const key = line.slice(0, colonIndex).trim().toLowerCase();
      const value = line.slice(colonIndex + 1).trim();

      // Handle duplicate headers by appending with comma (per HTTP spec)
      if (req.headers[key]) {
        if (Array.isArray(req.headers[key])) {
          req.headers[key].push(value);
        } else {
          req.headers[key] = [req.headers[key], value];
        }
      } else {
        req.headers[key] = value;
      }
    }

    // Parse query string and clean path
    try {
      const originalPath = req.path || '/';

      // Parse query parameters safely
      const queryStart = originalPath.indexOf('?');
      if (queryStart !== -1) {
        req.query = queryParser(originalPath);
        // Clean path after extracting query
        req.path = decodeURIComponent(originalPath.slice(0, queryStart)) || '/';
      } else {
        req.query = {};
        req.path = decodeURIComponent(originalPath) || '/';
      }
    } catch (error) {
      console.warn('Error parsing query string:', error);
      req.query = {};
      req.path = '/';
    }

    // Parse request body based on method and content type
    try {
      if (['POST', 'PUT', 'PATCH'].includes(req.method) && bodyPart) {
        const contentType = (req.headers['content-type'] || '').toLowerCase();

        if (contentType.includes('application/json')) {
          try {
            req.body = JSONbodyParser(bodyPart);
          } catch (error) {
            console.warn('Error parsing JSON body:', error);
            req.body = {};
          }
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          try {
            req.body = queryParser('?' + bodyPart);
          } catch (error) {
            console.warn('Error parsing form data:', error);
            req.body = {};
          }
        } else {
          // For other content types, keep as raw string
          req.body = bodyPart;
        }
      } else if (req.method === 'OPTIONS') {
        // Handle OPTIONS preflight request
        req.body = {};
        req.cors = {
          origin: req.headers['origin'],
          method: req.headers['access-control-request-method'] || '*',
          headers: req.headers['access-control-request-headers'] || ''
        };
      } else {
        req.body = undefined;
      }
    } catch (error) {
      console.warn('Error processing request body:', error);
      req.body = {};
    }

    return req;
  } catch (error) {
    console.error('Error parsing HTTP request:', error);
    throw error;
  }
}

module.exports = { httpParser }
