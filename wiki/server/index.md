# Hasty Server Core Module Documentation

The core server module that implements a lightweight HTTP server using [Node.js net module](https://nodejs.org/api/net.html).  
This module provides routing capabilities and request handling functionality.

## Classes

### Server
Base server class that handles TCP connections and route management.

```javascript
class Server {
  socket;
  constructor() {
    this.socket = getSocket(handler, this);
    this.routes = [];
  }
}
```

### Hasty
Main server class that extends the base Server class and provides HTTP functionality.

```javascript
class Hasty extends Server {
  constructor() {
    super();
    this.enableCors = false; // CORS disabled by default
    this.socket.on('data', () => this.handler());
  }
}
```

## Core Methods

### Route Handlers

```javascript
// Define routes for different HTTP methods
get(path, callback) {
  this.setRoute('GET', { callback, path });
}

post(path, callback) {
  this.setRoute('POST', { callback, path });
}

put(path, callback) {
  this.setRoute('PUT', { callback, path });
}

delete(path, callback) {
  this.setRoute('DELETE', { callback, path });
}

patch(path, callback) {
  this.setRoute('PATCH', { callback, path });
}

head(path, callback) {
  this.setRoute('HEAD', { callback, path });
}

options(path, callback) {
  this.setRoute('OPTIONS', { callback, path });
}
```

### Server Control Methods

```javascript
listen(PORT, callback) {
  this.socket.listen(PORT, callback);
}

close() {
  this.socket.close();
  warn('Server closed');
}

cors(enable) {
  this.enableCors = enable;
}
```

### Internal Helper Methods

```javascript
// Store route configuration
setRoute(method, object) {
  const route = new Object();
  route.callback = object.callback;
  route.path = object.path;
  route.method = method;
  this.routes.push(route);
}
```

## Request Handler

The main request handler function processes incoming HTTP requests:

```javascript
function handler(socket, context) {
  socket.on('data', (data) => {
    const res = new Response(socket, context.enableCors);
    const buff = data.toString();
    httpParser(buff)
      .then((data) => {
        pathController(data, context, res);
      })
      .catch((error) => {
        console.error('Error parsing HTTP request:', error);
        res.sendStatus(400);
      });
  });
}
```

## Route Matching

Routes are matched using parameter support:

```javascript
function matchRouteWithParams(routePath, actualPath) {
  const routeParts = routePath.split('/');
  const pathParts = actualPath.split('/');
  
  if (routeParts.length !== pathParts.length) return false;
  
  return routeParts.every((part, index) => {
    return part.startsWith(':') || part === pathParts[index];
  });
}
```

## Parameter Extraction

Extracts URL parameters from routes:

```javascript
function extractParams(routePath, actualPath) {
  const routeParts = routePath.split('/');
  const pathParts = actualPath.split('/');
  const params = {};
  
  routeParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
    }
  });
  
  return params;
}
```

## Usage Example

```javascript
const Hasty = require('./server/index');
const server = new Hasty();

// Define a route
server.get('/hello/:name', (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

// Enable CORS if needed
server.cors(true);

// Start the server
server.listen(8080, () => {
  console.log('Server running on port 8080');
});
```

## Dependencies

- `net` - [Node.js](https://nodejs.org/) native networking module
- `httpParser` - Custom HTTP request parser
- `Response` - Custom response handler class

## Notes

- Built on Node.js native `net` module for high performance
- Supports route parameters (e.g., `/user/:id`)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) support can be enabled/disabled
- Handles various [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) (GET, POST, PUT, etc.)
- Includes error handling for malformed requests
 