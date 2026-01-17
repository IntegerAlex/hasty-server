const { httpParser } = require('../lib/httpParser.js');
const net = require('net');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');
const Response = require('./response.js');
const { handlePreflight } = require('../lib/cors');
const logger = require('../lib/logger');

/**
 * @typedef {Object} Route
 * @property {string} method - HTTP method (GET, POST, etc.)
 * @property {string} path - URL path pattern
 * @property {Function} callback - Route handler function
 * @property {Array<Function>} [middleware] - Array of middleware functions
 */

/**
 * Creates a TCP server socket that handles incoming connections
 * @param {Function} callback - Request handler function
 * @param {Object} context - Server context object
 * @returns {net.Server} - Node.js Server instance
 */
function createServer(callback, context) {
  return net.createServer((socket) => {
    // Set socket timeout to prevent hanging connections
    socket.setTimeout(30000); // 30 seconds

    // Handle connection errors
    socket.on('error', (error) => {
      logger.error('Socket error', { error: error.message, stack: error.stack });
      if (!socket.destroyed) {
        socket.destroy();
      }
    });

    // Handle timeout
    socket.on('timeout', () => {
      logger.warn('Socket timeout - closing connection');
      socket.end('HTTP/1.1 408 Request Timeout\r\n\r\n');
    });

    callback(socket, context);
  });
}

/**
 * Handles incoming socket connections and processes HTTP requests
 * @param {net.Socket} socket - The socket connection
 * @param {Object} context - Server context with routes and configuration
 */
/**
 * Handles incoming socket connections and processes HTTP requests
 * @param {net.Socket} socket - The socket connection
 * @param {Object} context - Server context with routes and configuration
 */
function handleConnection(socket, context) {
  let buffer = Buffer.alloc(0);
  const maxRequestSize = context.maxRequestSize || 10 * 1024 * 1024; // Default 10MB
  const securityHeaders = context.securityHeaders;
  const rateLimit = context.rateLimit;

  socket.on('data', (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);

      // Check if buffer exceeds maximum request size
    if (buffer.length > maxRequestSize) {
      logger.warn('Request size exceeds maximum allowed size', {
        size: buffer.length,
        maxSize: maxRequestSize
      });
      if (socket.writable) {
        const res = new Response(socket, context.enableCors);
        res.status(413).send('Payload Too Large');
      }
      socket.destroy();
      return;
    }

    // Process as many requests as possible from the buffer
    while (buffer.length > 0) {
      // 1. Check for header end
      const headerEndIndex = buffer.indexOf('\r\n\r\n');
      if (headerEndIndex === -1) {
        // Headers not fully received yet
        break;
      }

      // 2. Parse headers to find Content-Length
      const headerPart = buffer.slice(0, headerEndIndex).toString();
      const contentLengthMatch = headerPart.match(/Content-Length:\s*(\d+)/i);
      const contentLength = contentLengthMatch ? parseInt(contentLengthMatch[1], 10) : 0;

      // 3. Check if we have the full body
      const totalRequestLength = headerEndIndex + 4 + contentLength;

      if (buffer.length < totalRequestLength) {
        // Body not fully received yet
        break;
      }

      // 4. Extract the full request
      const requestData = buffer.slice(0, totalRequestLength);

      // 5. Remove processed data from buffer
      buffer = buffer.slice(totalRequestLength);

      // 6. Process the request
      processRequest(socket, requestData, context)
        .catch(error => {
          console.error('Error processing request:', error);
          // Only send error if socket is still open and writable
          if (socket.writable) {
            const res = new Response(socket, context.enableCors);
            res.status(500).send('Internal Server Error');
          }
        });
    }
  });

  socket.on('error', (error) => {
    // console.error('Connection error:', error);
  });
}

/**
 * Processes an incoming HTTP request
 * @param {net.Socket} socket - The socket connection
 * @param {Buffer} requestData - Raw request data
 * @param {Object} context - Server context
 * @returns {Promise<void>}
 */
async function processRequest(socket, requestData, context) {
    // Parse the HTTP request first to check headers
  let req;
  // Generate unique request ID for tracing
  const requestId = crypto.randomUUID();

  try {
    req = await httpParser(requestData.toString());
    req.id = requestId; // Add request ID to request object
  } catch (error) {
    logger.error('Request parsing error', {
      error: error.message,
      stack: error.stack,
      requestDataLength: requestData.length,
      requestId
    });
    if (socket.writable) {
      const res = new Response(socket, context.enableCors);
      res.setHeader('X-Request-ID', requestId);
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid request format',
        requestId
      });
    }
    return;
  }

  // Determine if we should keep the connection alive
  // Default to true for HTTP/1.1, false for HTTP/1.0 unless Keep-Alive header is present
  const connectionHeader = (req.headers['connection'] || '').toLowerCase();
  const isHttp11 = req.version === 'HTTP/1.1';
  let shouldKeepAlive = isHttp11;

  if (connectionHeader === 'close') {
    shouldKeepAlive = false;
  } else if (connectionHeader === 'keep-alive') {
    shouldKeepAlive = true;
  }

  const res = new Response(socket, context.enableCors, shouldKeepAlive, req.method);

  // Add request ID to response headers for tracing
  res.setHeader('X-Request-ID', requestId);

  // Apply security headers if configured
  if (securityHeaders) {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }

  // Check rate limiting if configured
  if (rateLimit) {
    const clientIP = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;

    // Get or create client record
    if (!rateLimit.store.has(clientIP)) {
      rateLimit.store.set(clientIP, []);
    }

    const clientRequests = rateLimit.store.get(clientIP);

    // Remove old requests outside the window
    const validRequests = clientRequests.filter(timestamp => timestamp > windowStart);

    if (validRequests.length >= rateLimit.maxRequests) {
      logger.warn('Rate limit exceeded', {
        ip: clientIP,
        requests: validRequests.length,
        maxRequests: rateLimit.maxRequests
      });
      res.status(429).setHeader('Retry-After', Math.ceil(rateLimit.windowMs / 1000)).send(rateLimit.message);
      return;
    }

    // Add current request timestamp
    validRequests.push(now);
    rateLimit.store.set(clientIP, validRequests);
  }

  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS' && context.enableCors) {
      handlePreflight(req, res);
      return;
    }

    // Find matching route
    const route = findMatchingRoute(req.method, req.path, context.routes);

    if (!route) {
      logger.info('Route not found', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        requestId
      });
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        requestId
      });
      return;
    }

    // Extract URL parameters
    req.params = extractParams(route.path, req.path);

    // Parse query parameters
    if (req.path.includes('?')) {
      const url = new URL(`http://dummy${req.path}`);
      req.query = Object.fromEntries(url.searchParams.entries());
    } else {
      req.query = {};
    }

    // Execute route handler
    await route.callback(req, res);

  } catch (error) {
    logger.error('Request processing error', {
      error: error.message,
      stack: error.stack,
      method: req.method,
      path: req.path,
      ip: req.ip,
      requestId
    });
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
        requestId
      });
    }
  }
}

/**
 * Finds a matching route for the given method and path
 * @param {string} method - HTTP method
 * @param {string} path - Request path
 * @param {Array<Route>} routes - Available routes
 * @returns {Route|undefined} - Matched route or undefined
 */
function findMatchingRoute(method, path, routes) {
  // First try exact match
  const exactMatch = routes.find(
    route => route.method === method && route.path === path
  );

  if (exactMatch) return exactMatch;

  // Then try parameterized routes
  return routes.find(route =>
    route.method === method && matchRouteWithParams(route.path, path)
  );
}

/**
 * Checks if a route pattern matches a URL path, supporting parameters
 * @param {string} routePath - Route pattern (e.g., '/users/:id')
 * @param {string} urlPath - Actual URL path
 * @returns {boolean} - True if the route matches
 */
function matchRouteWithParams(routePath, urlPath) {
  const routeParts = routePath.split('/');
  const pathParts = urlPath.split('?')[0].split('/');

  if (routeParts.length !== pathParts.length) return false;

  return routeParts.every((part, i) =>
    part.startsWith(':') || part === pathParts[i]
  );
}

/**
 * Extracts parameters from a URL path based on a route pattern
 * @param {string} routePath - Route pattern with parameters (e.g., '/users/:id')
 * @param {string} urlPath - Actual URL path (e.g., '/users/123')
 * @returns {Object} - Extracted parameters
 */
function extractParams(routePath, urlPath) {
  const params = {};
  const routeParts = routePath.split('/');
  const pathParts = urlPath.split('?')[0].split('/');

  routeParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      params[part.slice(1)] = decodeURIComponent(pathParts[i]);
    }
  });

  return params;
}

/**
 * Base Server class that handles low-level socket operations
 * @class
 */
class Server {
  /**
   * Creates a new Server instance
   * @constructor
   */
  constructor() {
    /** @private */
    this.routes = [];

    /** @private */
    this.server = null;

    // Bind methods
    this.listen = this.listen.bind(this);
    this.close = this.close.bind(this);
  }

  /**
   * Starts the server listening on the specified port
   * @param {number} port - Port number to listen on
   * @param {Function} [callback] - Callback function when server starts
   * @returns {Promise<void>}
   */
  listen(port, callback) {
    return new Promise((resolve, reject) => {
      try {
        this.server = createServer(handleConnection, {
          routes: this.routes,
          enableCors: this.enableCors || false,
          maxRequestSize: this.maxRequestSize,
          securityHeaders: this.securityHeaders,
          rateLimit: this.rateLimit
        });

        this.server.on('error', (error) => {
          logger.error('Server error', { error: error.message, port });
          reject(error);
        });

        this.server.listen(port, '0.0.0.0', () => {
          logger.info('Server started successfully', { port });
          if (callback) callback();
          resolve();
        });

      } catch (error) {
        logger.error('Failed to start server', { error: error.message, port });
        reject(error);
      }
    });
  }

  /**
   * Stops the server
   * @returns {Promise<void>}
   */
  close() {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          logger.info('Server stopped successfully');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

/**
 * Hasty HTTP Server class that extends the base Server with routing capabilities
 * @extends Server
 */
class Hasty extends Server {
  /**
   * Creates a new Hasty server instance
   * @constructor
   */
  constructor() {
    super();

    /** @private */
    this.enableCors = false;

    /** @private */
    this.maxRequestSize = 10 * 1024 * 1024; // Default 10MB

    // Bind methods
    this.cors = this.cors.bind(this);
    this.setMaxRequestSize = this.setMaxRequestSize.bind(this);
  }

  /**
   * Enables or disables CORS support
   * @param {boolean} [enabled=true] - Whether to enable CORS
   * @returns {Hasty} - The server instance for chaining
   */
  cors(enabled = true) {
    this.enableCors = enabled;
    return this;
  }

  /**
   * Sets the maximum request size in bytes
   * @param {number} size - Maximum request size in bytes
   * @returns {Hasty} - The server instance for chaining
   * @example
   * // Set to 5MB
   * app.setMaxRequestSize(5 * 1024 * 1024);
   *
   * // Set to 1MB
   * app.setMaxRequestSize(1024 * 1024);
   */
  setMaxRequestSize(size) {
    if (typeof size !== 'number' || size <= 0) {
      throw new Error('Max request size must be a positive number');
    }
    this.maxRequestSize = size;
    return this;
  }

  /**
   * Enables or configures security headers for all responses
   * @param {boolean|Object} config - Security headers configuration
   * @returns {Hasty} - The server instance for chaining
   * @example
   * // Enable default security headers
   * app.setSecurityHeaders(true);
   *
   * // Custom security headers
   * app.setSecurityHeaders({
   *   'X-Content-Type-Options': 'nosniff',
   *   'X-Frame-Options': 'DENY',
   *   'X-XSS-Protection': '1; mode=block'
   * });
   */
  setSecurityHeaders(config) {
    if (config === true) {
      // Default security headers
      this.securityHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      };
    } else if (config === false) {
      this.securityHeaders = null;
    } else if (typeof config === 'object' && config !== null) {
      this.securityHeaders = { ...config };
    } else {
      throw new Error('Security headers config must be boolean or object');
    }
    return this;
  }

  /**
   * Enables or configures rate limiting
   * @param {boolean|Object} config - Rate limiting configuration
   * @returns {Hasty} - The server instance for chaining
   * @example
   * // Enable default rate limiting (100 requests per 15 minutes per IP)
   * app.setRateLimit(true);
   *
   * // Custom rate limiting
   * app.setRateLimit({
   *   windowMs: 15 * 60 * 1000, // 15 minutes
   *   maxRequests: 100, // limit each IP to 100 requests per windowMs
   *   message: 'Too many requests from this IP, please try again later.'
   * });
   */
  setRateLimit(config) {
    if (config === true) {
      // Default rate limiting: 100 requests per 15 minutes per IP
      this.rateLimit = {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100,
        message: 'Too many requests from this IP, please try again later.',
        store: new Map() // In-memory store
      };
    } else if (config === false) {
      this.rateLimit = null;
    } else if (typeof config === 'object' && config !== null) {
      this.rateLimit = {
        windowMs: config.windowMs || 15 * 60 * 1000,
        maxRequests: config.maxRequests || 100,
        message: config.message || 'Too many requests from this IP, please try again later.',
        store: config.store || new Map()
      };
    } else {
      throw new Error('Rate limit config must be boolean or object');
    }
    return this;
  }

  /**
   * Registers a route with the server
   * @private
   * @param {string} method - HTTP method
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  _registerRoute(method, path, callback) {
    // Normalize path - ensure it starts with a slash but don't modify parameter routes
    let normalizedPath = path;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = '/' + normalizedPath;
    }
    // Remove trailing slash unless it's the root path
    if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
      normalizedPath = normalizedPath.slice(0, -1);
    }

    this.routes.push({
      method: method.toUpperCase(),
      path: normalizedPath,
      callback: async (req, res) => {
        try {
          await callback(req, res);

          // If headers haven't been sent and the response hasn't been ended
          if (!res.headersSent && !res.finished) {
            res.end();
          }
        } catch (error) {
          logger.error('Route handler error', {
            error: error.message,
            stack: error.stack,
            method: req.method,
            path: req.path,
            ip: req.ip,
            requestId
          });
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Internal Server Error',
              message: 'An unexpected error occurred in route handler',
              requestId
            });
          }
        }
      }
    });
  }

  // HTTP method shortcuts

  /**
   * Registers a GET route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  get(path, callback) {
    this._registerRoute('GET', path, callback);
  }

  /**
   * Registers a POST route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  post(path, callback) {
    this._registerRoute('POST', path, callback);
  }

  /**
   * Registers a PUT route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  put(path, callback) {
    this._registerRoute('PUT', path, callback);
  }

  /**
   * Registers a DELETE route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  delete(path, callback) {
    this._registerRoute('DELETE', path, callback);
  }

  /**
   * Registers a PATCH route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  patch(path, callback) {
    this._registerRoute('PATCH', path, callback);
  }

  /**
   * Registers a HEAD route
   * @param {string} path - URL path pattern
   * @param {Function} callback - Route handler
   * @returns {void}
   */
  head(path, callback) {
    this._registerRoute('HEAD', path, callback);
  }

  /**
   * Registers an OPTIONS route
   * @param {string} path - URL path pattern
   * @param {Function} [callback] - Optional route handler
   * @returns {void}
   */
  options(path, callback) {
    if (callback) {
      this._registerRoute('OPTIONS', path, callback);
    } else {
      // Auto-handle OPTIONS for CORS
      this._registerRoute('OPTIONS', path, (req, res) => {
        if (this.enableCors) {
          handlePreflight(req, res);
        } else {
          res.status(200).end();
        }
      });
    }
  }

  /**
   * Serves static files from a directory
   * @param {string} root - Root directory to serve files from
   * @param {Object} [options] - Options for serving files
   * @param {string} [options.prefix='/'] - URL prefix for the static files
   * @returns {void}
   */
  static(root, options = {}) {
    const { prefix = '/' } = options;
    const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

    this.get(`${normalizedPrefix}*`, (req, res) => {
      // Remove the prefix and any leading slashes to get the relative path
      const relativePath = req.path.slice(normalizedPrefix.length).replace(/^\/+/, '');

      // Prevent directory traversal
      if (relativePath.includes('../') || relativePath.includes('..\\')) {
        return res.status(403).send('Forbidden');
      }

      // Join with the root directory and normalize the path
      const filePath = path.join(root, relativePath || 'index.html');

      // Send the file
      res.sendFile(filePath);
    });
  }
}

module.exports = Hasty

// const  routeHandler  = new RouteHandler()
// routeHandler.get({callback:()=>{
//	console.log("we are getting started")
// },path:"/"})
// routeHandler.setRoute("POST",{callback:()=>{},path:"/post"})
// server.listen(8080,()=>{V
//	console.log("server started");
// })
// routeHandler.listen(8080,()=>{
// console.log("server started")
// })
