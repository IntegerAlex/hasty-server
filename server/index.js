const { httpParser } = require('../lib/httpParser.js') // Import the httpParser function from the httpParser.js file
const net = require('net')// Import the net module from Node.JS
const Response = require('./response.js') // Import the response object

const { warn } = require('console')

function getSocket (callback, context) {
  return net.createServer(Socket => callback(Socket, context))
}

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

// Helper function to check if the route matches, including parameters
function matchRouteWithParams (routePath, actualPath) {
  const routeParts = routePath.split('/')
  const pathParts = actualPath.split('/')

  if (routeParts.length !== pathParts.length) return false

  return routeParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index]
  })
}

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

class Server {
  socket
  constructor () {
    this.socket = getSocket(handler, this)
    this.routes = []
  }

  listen (PORT, callback) {
    this.socket.listen(PORT, callback)
  }

  close () {
    this.socket.close()
    warn('Server closed')
  }
}

class Hasty extends Server {
  constructor () {
    super()
    this.enableCors = false // default to false
    this.socket.on('data', () => this.handler())
  }

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

  get (path, callback) {
    this.setRoute('GET', { callback, path })
  }

  post (path, callback) {
    this.setRoute('POST', { callback, path })
  }

  put (path, callback) {
    this.setRoute('PUT', { callback, path })
  }

  delete (path, callback) {
    this.setRoute('DELETE', { callback, path })
  }

  patch (path, callback) {
    this.setRoute('PATCH', { callback, path })
  }

  head (path, callback) {
    this.setRoute('HEAD', { callback, path })
  }

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
