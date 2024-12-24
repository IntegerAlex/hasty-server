const { httpParser } = require('../lib/httpParser.js') // Import the httpParser function from the httpParser.js file
const net = require('net')// Import the net module from Node.JS
const Response = require('./response.js') // Import the response object

const { warn } = require('console')

/**
 * Simple rate limiter implementation
 */
class RateLimiter {
  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.clients = new Map();
  }

  /**
   * Check if a client has exceeded their rate limit
   * @param {string} clientIp - Client's IP address
   * @returns {boolean} - Whether the client is rate limited
   */
  isRateLimited(clientIp) {
    const now = Date.now();
    const clientData = this.clients.get(clientIp) || { count: 0, resetTime: now + this.windowMs };

    // Reset counter if window has passed
    if (now >= clientData.resetTime) {
      clientData.count = 0;
      clientData.resetTime = now + this.windowMs;
    }

    clientData.count++;
    this.clients.set(clientIp, clientData);

    return clientData.count > this.maxRequests;
  }
}

/**
 * Default security headers for responses
 */
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'"
};

/**
 * Create a TCP server with a handler function
 * @param {Function} callback - Handler function for socket events
 * @param {Object} context - Server context object
 * @returns {net.Server} TCP server instance
 */
function getSocket(callback, context) {
  return net.createServer(Socket => callback(Socket, context))
}

/**
 * Handle incoming socket connections
 * @param {net.Socket} socket - TCP socket connection
 * @param {Object} context - Server context object
 */
function handler(socket, context) {
  const rateLimiter = new RateLimiter();
  socket.setTimeout(120000);
  
  socket.on('timeout', () => {
    socket.end();
  });
  
  socket.on('data', (rawData) => {
    const clientIp = socket.remoteAddress;
    
    // Check rate limit
    if (rateLimiter.isRateLimited(clientIp)) {
      const res = new Response(socket, context.enableCors);
      res.setHeaders({
        'Retry-After': '60',
        ...securityHeaders
      });
      res.sendStatus(429); // Too Many Requests
      return;
    }

    const res = new Response(socket, context.enableCors);
    // Add security headers to all responses
    res.setHeaders(securityHeaders);
    
    const buff = rawData.toString();
    httpParser(buff)
      .then((parsedData) => {
        pathController(parsedData, context, res);
      })
      .catch((error) => {
        console.error('Error parsing HTTP request:', error);
        res.sendStatus(400);
      });
  });
}

/**
 * Handle routing of HTTP requests
 * @param {Object} data - Parsed HTTP request data
 * @param {Object} context - Server context object
 * @param {Object} res - Response object
 */
function pathController(data, context, res) {
  const requestPath = data.path;
  const requestMethod = data.method;

  // Find the matching route, accounting for parameters
  const matchedRoute = context.routes.find(routeConfig => {
    return matchRouteWithParams(routeConfig.path, requestPath) && routeConfig.method === requestMethod;
  });

  if (matchedRoute) {
    // Extract parameters from the matched route
    const params = extractParams(matchedRoute.path, requestPath);
    data.params = params;
    matchedRoute.callback(data, res);
  } else {
    res.sendStatus(404);
  }
}

/**
 * Check if a route path matches the actual path, including parameters
 * @param {string} routePath - Route path pattern
 * @param {string} actualPath - Actual request path
 * @returns {boolean} Whether the paths match
 */
function matchRouteWithParams(routePath, actualPath) {
  const routeParts = routePath.split('/');
  const pathParts = actualPath.split('/');

  if (routeParts.length !== pathParts.length) return false;

  return routeParts.every((routePart, index) => {
    return routePart.startsWith(':') || routePart === pathParts[index];
  });
}

/**
 * Extract parameters from a matched route
 * @param {string} routePath - Route path pattern
 * @param {string} actualPath - Actual request path
 * @returns {Object} Extracted parameters
 */
function extractParams(routePath, actualPath) {
  const routeParts = routePath.split('/');
  const pathParts = actualPath.split('/');
  const params = {};

  routeParts.forEach((routePart, index) => {
    if (routePart.startsWith(':')) {
      const paramName = routePart.slice(1);
      params[paramName] = pathParts[index];
    }
  });

  return params;
}

/**
 * Base Server class that handles TCP socket connections
 * @class
 */
class Server {
  socket;

  /**
   * Create a new Server instance
   */
  constructor() {
    this.socket = getSocket(handler, this);
    this.routes = [];
  }

  /**
   * Start the server on specified port
   * @param {number} PORT - Port number to listen on
   * @param {Function} callback - Callback function to execute when server starts
   */
  listen(PORT, callback) {
    this.socket.listen(PORT, callback);
  }

  /**
   * Close the server and all active connections
   */
  close() {
    this.socket.close();
    warn('Server closed');
  }
}

/**
 * Hasty framework main class
 * Extends base Server class with HTTP-specific functionality
 * @extends Server
 */
class Hasty extends Server {
  constructor() {
    super();
    this.enableCors = false; // default to false
  }

  /**
   * Internal method to set route configuration
   * @param {string} method - HTTP method (GET, POST, etc)
   * @param {Object} object - Route configuration object
   * @param {string} object.path - URL path for the route
   * @param {Function} object.callback - Handler function for the route
   * @private
   */
  setRoute(method, object) {
    const route = new Object();
    route.callback = object.callback;
    route.path = object.path;
    route.method = method;
    this.routes.push(route);
  }

  /**
   * Enable or disable CORS support
   * @param {boolean} enable - Whether to enable CORS
   */
  cors(enable) {
    this.enableCors = enable;
  }

  /**
   * Register a GET route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  get(path, callback) {
    this.setRoute('GET', { callback, path });
  }

  /**
   * Register a POST route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  post(path, callback) {
    this.setRoute('POST', { callback, path });
  }

  /**
   * Register a PUT route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  put(path, callback) {
    this.setRoute('PUT', { callback, path });
  }

  /**
   * Register a DELETE route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  delete(path, callback) {
    this.setRoute('DELETE', { callback, path });
  }

  /**
   * Register a PATCH route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  patch(path, callback) {
    this.setRoute('PATCH', { callback, path });
  }

  /**
   * Register a HEAD route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  head(path, callback) {
    this.setRoute('HEAD', { callback, path });
  }

  /**
   * Register an OPTIONS route
   * @param {string} path - URL path
   * @param {Function} callback - Route handler function
   */
  options(path, callback) {
    this.setRoute('OPTIONS', { callback, path });
  }
}

module.exports = Hasty;
