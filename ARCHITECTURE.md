# Hasty Server Architecture

## Overview

Hasty Server is a lightweight, educational HTTP server framework built from scratch using Node.js raw TCP sockets. It provides Express.js-like functionality without any third-party dependencies, making it perfect for learning HTTP internals and server architecture.

## Core Architecture

### 1. Modular Design

The server is organized into distinct modules, each with a specific responsibility:

```
hasty-server/
├── server/
│   ├── index.js      # Main server class and routing logic
│   └── response.js   # HTTP response handling
├── lib/
│   ├── httpParser.js # HTTP request parsing
│   ├── cors.js       # CORS utilities
│   ├── utils.js      # General utilities
│   └── mimeDb.js     # MIME type database
└── test-server.js    # Example usage
```

### 2. Request/Response Flow

```
Incoming TCP Connection
         ↓
    Socket Handler
         ↓
    HTTP Parser (lib/httpParser.js)
         ↓
    Route Matcher (server/index.js)
         ↓
    Route Handler (user-defined)
         ↓
    Response Builder (server/response.js)
         ↓
    CORS Headers (lib/cors.js)
         ↓
    TCP Socket Response
```

## Core Components

### 1. Server Class (`server/index.js`)

**Purpose**: Main server orchestration and routing

**Key Features**:
- TCP server creation and management
- Route registration and matching
- Request lifecycle management
- Error handling and timeouts

**Architecture**:
```javascript
class Hasty extends Server {
  // Route registration methods (get, post, put, delete, etc.)
  // CORS configuration
  // Static file serving
  // Server lifecycle management
}
```

### 2. Response Class (`server/response.js`)

**Purpose**: HTTP response construction and sending

**Key Features**:
- Chainable API (`res.status(200).json(data)`)
- Multiple response types (JSON, files, streams)
- Automatic content-type detection
- CORS header integration

**Architecture**:
```javascript
class Response {
  // Status code management
  // Header manipulation
  // Content sending (send, json, sendFile, download)
  // CORS integration
}
```

### 3. HTTP Parser (`lib/httpParser.js`)

**Purpose**: Raw HTTP request parsing

**Key Features**:
- Request line parsing (method, path, version)
- Header parsing with validation
- Body parsing (JSON, form-urlencoded)
- Query string parsing
- Safe fallbacks for malformed requests

### 4. CORS Utility (`lib/cors.js`)

**Purpose**: Centralized CORS handling

**Key Features**:
- Default CORS headers
- Preflight OPTIONS handling
- Configurable CORS policies

## Data Flow

### 1. Connection Handling

```javascript
// 1. TCP connection established
socket.on('data', (chunk) => {
  // 2. Accumulate request data
  requestData = Buffer.concat([requestData, chunk]);
  
  // 3. Check for complete request
  if (requestData.includes('\r\n\r\n')) {
    processRequest(socket, requestData, context);
  }
});
```

### 2. Request Processing

```javascript
async function processRequest(socket, requestData, context) {
  // 1. Parse HTTP request
  const req = await httpParser(requestData.toString());
  
  // 2. Handle CORS preflight
  if (req.method === 'OPTIONS' && context.enableCors) {
    return handlePreflight(res);
  }
  
  // 3. Find matching route
  const route = findMatchingRoute(req.method, req.path, context.routes);
  
  // 4. Extract parameters and query
  req.params = extractParams(route.path, req.path);
  req.query = parseQuery(req.path);
  
  // 5. Execute route handler
  await route.callback(req, res);
}
```

### 3. Route Matching

The server uses a two-phase matching strategy:

1. **Exact Match**: Direct path comparison
2. **Parameter Match**: Pattern matching with `:param` syntax

```javascript
// Route: /users/:id
// Path: /users/123
// Result: { params: { id: '123' } }
```

### 4. Response Generation

```javascript
class Response {
  send(data) {
    // 1. Apply CORS headers if enabled
    this._applyCorsHeaders();
    
    // 2. Set content headers
    this.setHeader('Content-Type', contentType);
    this.setHeader('Content-Length', contentLength);
    
    // 3. Send HTTP response
    this.socket.write(`HTTP/1.1 ${statusCode} ${statusText}\r\n${headers}\r\n\r\n`);
    this.socket.write(data);
  }
}
```

## Type Safety

The entire codebase uses JSDoc annotations for TypeScript compatibility:

```javascript
/**
 * @typedef {Object} Route
 * @property {string} method - HTTP method
 * @property {string} path - URL path pattern
 * @property {Function} callback - Route handler
 */

/**
 * Registers a route with the server
 * @param {string} method - HTTP method
 * @param {string} path - URL path pattern
 * @param {Function} callback - Route handler
 */
_registerRoute(method, path, callback) { ... }
```

## Error Handling

### 1. Connection Level
- Socket timeouts (30 seconds)
- Connection error handling
- Resource cleanup

### 2. Request Level
- Malformed HTTP request handling
- Invalid route handling (404)
- Route handler errors (500)

### 3. Response Level
- Header validation
- Stream error handling
- File serving errors

## Security Features

### 1. Input Validation
- HTTP method validation
- Path normalization
- Parameter URL decoding

### 2. File Serving Security
- Directory traversal prevention
- Safe path joining
- MIME type validation

### 3. Resource Management
- Connection timeouts
- Memory-efficient streaming
- Proper socket cleanup

## Performance Considerations

### 1. Efficient Parsing
- Single-pass HTTP parsing
- Minimal memory allocation
- Stream-based file serving

### 2. Route Optimization
- Exact match priority
- Efficient parameter extraction
- Route caching potential

### 3. Connection Management
- Non-blocking I/O
- Connection pooling ready
- Graceful shutdown support

## Usage Examples

### Basic Server
```javascript
const Hasty = require('./server/index.js');
const app = new Hasty();

app.cors(true);
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000);
```

### Advanced Features
```javascript
// Parameterized routes
app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

// Static file serving
app.static('./public', { prefix: '/assets' });

// Custom CORS handling
app.options('/api/*', (req, res) => {
  res.status(200).end();
});
```

## Educational Value

This architecture demonstrates:
- Raw TCP socket programming
- HTTP protocol implementation
- Asynchronous JavaScript patterns
- Modular code organization
- Type-safe JavaScript development
- Security best practices
- Performance optimization techniques

The codebase serves as an excellent learning resource for understanding how modern web frameworks work under the hood while maintaining production-ready code quality.
