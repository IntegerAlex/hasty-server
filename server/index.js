const { httpParser } = require('../lib/httpParser.js') // Import the httpParser function from the httpParser.js file
const net = require('net')// Import the net module from Node.JS
const Response = require('./response.js') // Import the response object

const { warn } = require('console')

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
  socket.setTimeout(120000);
  
  socket.on('timeout', () => {
    socket.end();
  });
  
  socket.on('data', (data) => {
    const res = new Response(socket, context.enableCors) // Set up a new Response object with the socket and cors state
    const buff = data.toString() // Convert buffer data to string
		 httpParser(buff)
      .then((data) => {
        pathController(data, context, res)
      })
      .catch((error) => {
        console.error('Error parsing HTTP request:', error)
        res.sendStatus(400) // Send a Bad Request status
      })
  })
}

/**
 * Handle routing of HTTP requests
 * @param {Object} data - Parsed HTTP request data
 * @param {Object} context - Server context object
 * @param {Object} res - Response object
 */
function pathController(data, context, res) {
  const path = data.path
  const method = data.method

  // Find the matching route, accounting for parameters
  const route = context.routes.find(route => {
    return matchRouteWithParams(route.path, path) && route.method === method
  })

  if (route) {
    // Extract parameters from the matched route
    const params = extractParams(route.path, path)
    // Log extracted params

    data.params = params // Attach extracted params to data
    route.callback(data, res) // Pass the updated data with params
  } else {
    res.sendStatus(404) // Route not found
  }
}

/**
 * Check if a route path matches the actual path, including parameters
 * @param {string} routePath - Route path pattern
 * @param {string} actualPath - Actual request path
 * @returns {boolean} Whether the paths match
 */
function matchRouteWithParams(routePath, actualPath) {
  const routeParts = routePath.split('/')
  const pathParts = actualPath.split('/')

  if (routeParts.length !== pathParts.length) return false

  return routeParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index]
  })
}

/**
 * Extract parameters from a matched route
 * @param {string} routePath - Route path pattern
 * @param {string} actualPath - Actual request path
 * @returns {Object} Extracted parameters
 */
function extractParams(routePath, actualPath) {
  const routeParts = routePath.split('/')
  const pathParts = actualPath.split('/')
  const params = {}

  routeParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1) // Remove the colon (:) from parameter name
      params[paramName] = pathParts[index] // Assign actual path value
    }
  })

  return params
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
    this.socket.on('data', () => this.handler());
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
