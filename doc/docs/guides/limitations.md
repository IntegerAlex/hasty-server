---
title: Known Limitations
description: Understanding what Hasty Server does NOT support - critical for setting proper expectations
---

# ⚠️ Known Limitations

**This page is critical for understanding what Hasty Server does NOT support.** All examples in the documentation are limited to these actual capabilities.

## What Hasty Server Does NOT Support

### ❌ No Middleware System
- **No `app.use()` method** - Express-style middleware is not implemented
- **No middleware stack** - Cannot chain middleware functions
- **No global request/response interceptors**
- **No error-handling middleware with 4 parameters**

### ❌ No Advanced Routing
- **No Router class** - Cannot create modular route handlers
- **No route-specific middleware** - Cannot attach middleware to specific routes
- **No route groups or prefixes** (except basic static file prefix)
- **No route parameter validation or transformation**

### ❌ No Built-in Body Parsing
- **No automatic JSON parsing** - Must manually parse request bodies
- **No form data parsing** - Must implement manually
- **No file upload handling** - Not supported
- **No request size limits** - No built-in protection

### ❌ No Advanced Static File Features
- **No caching headers** - Cannot set Cache-Control, ETag, etc.
- **No compression** - No gzip/brotli support
- **No custom MIME types** - Basic detection only
- **No directory listing** - Returns 403 for directories without index.html
- **No custom error pages** - Basic error responses only

### ❌ No Security Features
- **No HTTPS support** - HTTP only
- **No rate limiting** - Must implement manually
- **No request size limits**
- **No security headers** - No helmet-style protections
- **No CSRF protection**
- **No input sanitization**

### ❌ No Advanced CORS
- **Basic CORS only** - Simple enable/disable
- **No origin validation** - Cannot restrict specific origins
- **No credentials support**
- **No preflight customization**

### ❌ No Session Management
- **No session support** - Must implement manually
- **No cookie parsing** - Must implement manually
- **No authentication helpers**

### ❌ No Template Engines
- **No view rendering** - Cannot render templates
- **No template engine integration**

### ❌ No WebSocket Support
- **HTTP only** - No WebSocket upgrade handling

## What Hasty Server DOES Support

### ✅ Basic HTTP Server
- TCP socket-based HTTP server
- Support for GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS methods
- Route parameter extraction (e.g., `/users/:id`)
- Query string parsing
- Basic request/response objects

### ✅ Static File Serving
- Serve files from a directory
- Optional URL prefix
- Directory traversal protection
- Automatic index.html serving
- Basic MIME type detection

### ✅ Basic CORS
- Enable/disable CORS for all routes
- Automatic OPTIONS handling when CORS is enabled

### ✅ Response Methods
- `res.json()` - Send JSON responses
- `res.send()` - Send text/buffer responses
- `res.sendFile()` - Send file responses
- `res.download()` - Force file downloads
- `res.status()` - Set status codes
- `res.setHeader()` - Set response headers

## Code Examples - What Actually Works

### ✅ Basic Server Setup
```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Enable CORS
app.cors(true);

// Serve static files
app.static('public');

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000);
```

### ✅ Route Parameters
```javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId });
});
```

### ✅ Manual Body Parsing
```javascript
app.post('/users', (req, res) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    try {
      const body = JSON.parse(data);
      res.status(201).json({ id: Date.now(), ...body });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});
```

## Code Examples - What Does NOT Work

### ❌ Middleware (Does NOT exist)
```javascript
// THIS DOES NOT WORK - app.use() is not implemented
app.use((req, res, next) => {
  console.log('This will cause an error');
  next();
});
```

### ❌ Router (Does NOT exist)
```javascript
// THIS DOES NOT WORK - Router is not implemented
const router = new Hasty.Router();
router.get('/users', handler);
app.use('/api', router);
```

### ❌ Advanced Static Options (Does NOT work)
```javascript
// THIS DOES NOT WORK - Advanced options not supported
app.static('public', {
  etag: true,           // Not supported
  maxAge: '1d',         // Not supported
  setHeaders: () => {}  // Not supported
});
```

## Migration from Express

If you're coming from Express, these features are **NOT available**:

- `app.use()` middleware
- `express.json()` body parser
- `express.static()` advanced options
- `app.route()` method chaining
- Router modules
- Template engines
- Session middleware
- Authentication middleware
- Error handling middleware

## Performance Characteristics

- **Single-threaded** - No cluster support
- **No connection pooling**
- **No request queuing**
- **No load balancing**
- **Basic error handling** - Server may crash on unhandled errors

## When to Use Hasty Server

### ✅ Good For:
- Learning HTTP server fundamentals
- Simple APIs with basic routing
- Educational projects
- Prototyping
- Understanding how web servers work

### ❌ Not Good For:
- Production applications
- Complex routing requirements
- Applications needing middleware
- High-performance requirements
- Security-critical applications
- Applications requiring advanced features

## Conclusion

Hasty Server is intentionally minimal and educational. It provides basic HTTP server functionality without the complexity of frameworks like Express. Understanding these limitations is crucial for setting proper expectations and choosing the right tool for your project.
