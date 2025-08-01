---
sidebar_position: 1
---

# Introduction to Hasty Server

**Hasty Server** is a lightweight, educational web server framework built with raw TCP sockets in JavaScript. It provides Express.js-like functionality while maintaining zero dependencies and serving as a learning tool for understanding HTTP internals.

## 🎯 What is Hasty Server?

Hasty Server is designed as a **minimal, educational web framework** that helps developers understand:
- How HTTP servers work under the hood
- Raw TCP socket programming
- HTTP request/response parsing
- Basic routing mechanisms
- CORS implementation
- Static file serving

:::info Educational Purpose
This is intentionally **not a production-ready server**. It's built for learning and experimentation, providing a clear view into web server fundamentals without the complexity of full-featured frameworks.
:::

## ✨ Key Features

- **Zero Dependencies**: Built entirely with Node.js built-ins
- **Express-like API**: Familiar routing patterns (`app.get()`, `app.post()`, etc.)
- **TypeScript Support**: Full IntelliSense via JSDoc annotations (no build step required)
- **CORS Support**: Built-in CORS handling with preflight OPTIONS
- **Static Files**: Basic static file serving with security protections
- **Route Parameters**: Dynamic route matching with safe URL decoding
- **Chainable API**: Fluent response methods for clean code

## 🚀 Quick Start

```javascript
const { createServer } = require('hasty-server');

const app = createServer();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Hasty Server!' });
});

// Route with parameters
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId, message: `User ${userId} details` });
});

// Enable CORS
app.cors(true);

// Serve static files
app.static('/public', './static');

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## 📚 Learning Path

1. **[Quick Start](./getting-started/quick-start)** - Get up and running in minutes
2. **[Routing Guide](./guides/routing)** - Understand route handling and parameters
3. **[Static Files Guide](./guides/static-files)** - Learn about serving static assets
4. **[Error Handling Guide](./guides/error-handling)** - Handle errors gracefully
5. **[Limitations Guide](./guides/limitations)** - Understand what Hasty Server does NOT support

## 🔧 Technical Overview

### Architecture
- **Raw TCP Sockets**: Direct TCP connection handling
- **HTTP Parser**: Custom HTTP request/response parsing
- **Route Matcher**: Deterministic route matching algorithm
- **Response Handler**: Stream-based response processing
- **Security**: Basic security protections (directory traversal prevention)

### Core Components
- `server/index.js` - Main server implementation
- `server/response.js` - Response handling and utilities
- `lib/httpParser.js` - HTTP request parsing
- `lib/cors.js` - CORS handling utilities

## 🎯 When to Use Hasty Server

✅ **Perfect for:**
- Learning HTTP server internals
- Understanding web framework fundamentals
- Educational projects and tutorials
- Prototyping basic web servers
- Understanding CORS implementation

❌ **Not suitable for:**
- Production applications
- High-traffic websites
- Complex web applications
- Enterprise-grade security requirements

## 🎓 Educational Value

Hasty Server provides transparent implementation of:
- **HTTP Protocol**: See exactly how HTTP requests are parsed
- **TCP Networking**: Understand socket programming basics
- **Routing**: Learn how URL patterns are matched
- **Middleware Concepts**: Understand request processing pipelines
- **Security**: See basic security implementations

## 🚀 Next Steps

Ready to dive deeper? Start with our [Quick Start Guide](./getting-started/quick-start) to get your first Hasty Server running in under 5 minutes!

Then explore:
- [Routing Guide](./guides/routing) - Understand route handling
- [Static Files Guide](./guides/static-files) - Learn about serving static assets
- [Error Handling Guide](./guides/error-handling) - Handle errors gracefully
- [Limitations Guide](./guides/limitations) - Understand what Hasty Server does NOT support

---

*Built with ❤️ for the developer community. Hasty Server is open source and welcomes contributions!*
