const { httpParser } = require('../lib/httpParser.js') // Import the httpParser function from the httpParser.js file
const net = require('net')// Import the net module from Node.JS
const Response = require('./response.js') // Import the response object

const { warn } = require('console')

/**
 * 
 * @param {Function} callback - The callback function to handle incoming connections.
 * @param {Object} context - The context object containing the server configuration.
 * @returns A server socket object.
 * 
 * @example
 * ```javascript
 * const server = getSocket(handler, {
 *   enableCors: true,
 *   routes: [
 *     {
 *       path: '/',
 *       callback: (data, socket) => {
 *         socket.sendStatus(200)
 *       }
 *     }
 *   ]
 * });
 */
function getSocket (callback, context) {
  return net.createServer(Socket => callback(Socket, context))
}


/**
 * 
 * @param {Socket} socket - The socket object for the response.
 * @param {Object} context - The context object containing the server configuration.
 * @returns A server socket object. 
 */
function handler (socket, context) {
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
        return null
      });
  });
}

/**
 * Controls routing based on path and method, matching routes and handling parameters
 * @param {Object} data - The data object containing the HTTP request data
 * @param {string} data.path - The requested URL path
 * @param {string} data.method - The HTTP method (GET, POST, etc.)
 * @param {Object} [data.params] - Parameters extracted from the URL (populated during execution)
 * @param {Object} context - The context object containing the server configuration
 * @param {Array<Object>} context.routes - Array of route definitions
 * @param {string} context.routes[].path - Path pattern for the route
 * @param {string} context.routes[].method - HTTP method for the route
 * @param {Function} context.routes[].callback - Handler function for the route
 * @param {Object} res - The Response object for the response
 * @param {Function} res.sendStatus - Function to send HTTP status code
 */
function pathController (data, context, res) {
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
    return null
  }
}

/**
 * Matches a route pattern with a given URL path and extracts parameters
 * @param {string} routePath - The route pattern (e.g., '/users/:id')
 * @param {string} urlPath - The actual URL path to match against
 * @returns {boolean} - Returns true if the route matches the URL path, false otherwise
 */
// Helper function to check if the route matches, including parameters
function matchRouteWithParams (routePath, actualPath) {
  const routeParts = routePath.split('/')
  const pathParts = actualPath.split('/')

  if (routeParts.length !== pathParts.length) return false

  return routeParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index]
  })
}

/**
 * Extracts parameters from a matched route by comparing route pattern with actual path
 * @param {string} routePath - The route pattern containing parameter placeholders (e.g., '/users/:id')
 * @param {string} actualPath - The actual URL path with parameter values (e.g., '/users/123')
 * @returns {Object} params - Object containing extracted parameters
 * @returns {string} params[paramName] - The value for each parameter found in the path
 * @example
 * extractParams('/users/:id', '/users/123') // returns { id: '123' }
 * extractParams('/users/:userId/posts/:postId', '/users/123/posts/456') // returns { userId: '123', postId: '456' }
 */
// Helper function to extract params from the matched route
function extractParams (routePath, actualPath) {
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

// function pathController(data,context, socket) {
//    const path = data.path;
//	const  method = data.method
//    console.log("pathController: " + method + ": " + path);
//
//
//
//
//    // Check if the path exists in the context.routes
//    const route = context.routes.find(route => route.path === path && route.method === method);
//    if (route) route.callback(data, socket);
//	  else socket.sendStatus(404);
// }
//

/**
 * Represents a server instance that handles HTTP requests
 * @class
 */
class Server {
  socket
    /**
   * Creates a new Server instance
   * @constructor
   */
  constructor () {
    /**
     * Socket instance used for handling connections
     * @type {Socket}
     * @private
     */
    this.socket = getSocket(handler, this)
     /**
     * Array of routes registered with the server
     * @type {Array}
     * @private
     */
    this.routes = []
  }

   /**
   * Starts the server listening on specified port
   * @param {number} PORT - The port number to listen on
   * @param {Function} callback - Callback function to execute when server starts listening
   * @returns {void}
   */
  listen (PORT, callback) {
    this.socket.listen(PORT, callback)
  }

  close () {
    this.socket.close()
    warn('Server closed')
  }
}

class Hasty extends Server {
   /**
   * Creates a new Hasty server instance
   * @constructor
   */
  constructor () {
    super()
     /**
     * Collection of middleware functions
     * @type {Array<Function>}
     * @private 
     */
    this.enableCors = false // default to false
    /**
     * Configuration options for the server
     * @type {Object}
     * @private
     */
    this.socket.on('data', () => this.handler())
  }

  /**
   * Sets a route for the server
   * @param {string} method - The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE')
   * @param {Object} object - Object containing the callback function and path
   * @param {string} object.path - The path for the route
   * @param {Function} object.callback - The callback function to execute when the route is matched
   * @returns {void}
   */
  setRoute (method, object) {
    const route = new Object()
    route.callback = object.callback
    route.path = object.path
    route.method = method
    this.routes.push(route)
  }

  //  Enable CORS
  cors (enable) {
    this.enableCors = enable
  }
  /**
   * GET
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  get (path, callback) {
    this.setRoute('GET', { callback, path })
  }

  /**
   * POST
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  post (path, callback) {
    this.setRoute('POST', { callback, path })
  }

  /**
   * PUT
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  put (path, callback) {
    this.setRoute('PUT', { callback, path })
  }

  /**
   * DELETE
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  delete (path, callback) {
    this.setRoute('DELETE', { callback, path })
  }

  /**
   * PATCH
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  patch (path, callback) {
    this.setRoute('PATCH', { callback, path })
  }

  /**
   * HEAD
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  head (path, callback) {
    this.setRoute('HEAD', { callback, path })
  }

  /**
   * OPTIONS
   * 
   * @param {string} path 
   * @param {Function} callback 
   */
  options (path, callback) {
    this.setRoute('OPTIONS', { callback, path })
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
