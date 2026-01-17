# Hasty 
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/IntegerAlex/hasty-server/badge)](https://scorecard.dev/viewer/?uri=github.com/IntegerAlex/hasty-server)
![NPM Version](https://img.shields.io/npm/v/hasty-server)
![NPM Downloads](https://img.shields.io/npm/d18m/hasty-server)
![NPM License](https://img.shields.io/npm/l/hasty-server)
 
**Help needed**: I am looking for contributors to help me with this project. If you are interested, please let me know.

Hasty Server is a lightweight, zero-dependency HTTP framework built with raw TCP sockets in Node.js. Inspired by Express.js, it provides a clean API for building web servers and APIs while teaching HTTP internals.

###  table of contents
- [Installation](#installation)
- [Module Support](#module-support)
- [Usage](#usage)
- [Request Object](#request-object)
- [Contributing](#contributing)
- [CHANGELOG](CHANGELOG.md)
- [LICENSE](LICENSE.md)


### Framework Status

Hasty Server is a **production-ready HTTP framework** designed for building web APIs and applications. It provides enterprise-grade security features while maintaining zero dependencies.

**What Hasty Server provides:**
- ✅ **HTTP/1.1 compliant** server with proper request/response handling
- ✅ **Security features**: Configurable security headers, rate limiting, request size limits, CORS security
- ✅ **Request tracing**: Unique request IDs for debugging and monitoring
- ✅ **Structured logging**: Production-ready logging system
- ✅ **Error handling**: Consistent JSON error responses
- ✅ **Static file serving** with security protections
- ✅ **Zero dependencies**: Pure Node.js implementation

**What you need to add:**
- 🔧 **Input validation**: Use Zod, Joi, Yup, or your preferred validation library
- 🔐 **Authentication**: Implement JWT, sessions, or OAuth as needed
- 💾 **Database**: Add MongoDB, PostgreSQL, or your preferred database
- 🚀 **External services**: Redis for caching, reverse proxy for HTTPS
- 📊 **Monitoring**: Add health checks, metrics, and alerting

**Perfect for:**
- Learning HTTP internals and server architecture
- Building APIs with your preferred tools and libraries
- Zero-dependency deployments
- Custom server implementations

**Not suitable for:**
- Applications requiring middleware systems (Express-style `app.use()`)
- Complex routing with nested middleware
- Built-in authentication or database integration

### Installation
```bash
npm install hasty-server
```

### Module Support

Hasty Server supports multiple module systems for maximum compatibility:

#### ✅ CommonJS (Default)

```javascript
const Hasty = require('hasty-server');
const server = new Hasty();
```

#### ✅ ES Modules (ESM)

```javascript
import Hasty from 'hasty-server';
const server = new Hasty();
```

#### ✅ TypeScript

```typescript
import Hasty from 'hasty-server';

const app = new Hasty();

// Enable security features
app.setSecurityHeaders(true);
app.setRateLimit(true);

app.get('/', (req, res) => {
    res.json({ message: 'Hello from TypeScript!' });
});
```

#### ✅ Dual Package Support

The framework automatically detects your module system and provides the appropriate format:

- **CommonJS projects**: Uses `.js` files
- **ESM projects**: Uses `.mjs` files  
- **TypeScript projects**: Uses `.d.ts` type definitions

### Usage  

```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Enable production-ready security features
app.setSecurityHeaders(true);        // XSS, CSRF, clickjacking protection
app.setRateLimit(true);             // Rate limiting (100 req/15min per IP)
app.setMaxRequestSize(5 * 1024 * 1024); // 5MB request size limit

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World', timestamp: new Date().toISOString() });
});

app.post('/api/users', (req, res) => {
    // Add your validation logic here (Zod, Joi, etc.)
    // Add your database logic here
    res.status(201).json({ id: 1, created: true });
});

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
```

### API Reference

#### Server Methods

- `app.get(path, handler)` - Handle GET requests
- `app.post(path, handler)` - Handle POST requests
- `app.put(path, handler)` - Handle PUT requests
- `app.delete(path, handler)` - Handle DELETE requests
- `app.patch(path, handler)` - Handle PATCH requests
- `app.head(path, handler)` - Handle HEAD requests
- `app.options(path, handler)` - Handle OPTIONS requests

#### Security & Configuration

- `app.setSecurityHeaders(config)` - Enable security headers
- `app.setRateLimit(config)` - Configure rate limiting
- `app.setMaxRequestSize(bytes)` - Set maximum request size
- `app.cors(enabled)` - Enable/disable CORS

#### Response Methods

- `res.send(data)` - Send response data
- `res.json(data)` - Send JSON response
- `res.status(code)` - Set HTTP status code
- `res.setHeader(key, value)` - Set response header
- `res.sendFile(path)` - Send file as response

#### Request Object

- `req.method` - HTTP method (GET, POST, etc.)
- `req.path` - Request path
- `req.query` - Parsed query parameters
- `req.params` - URL parameters
- `req.body` - Parsed request body
- `req.headers` - Request headers
- `req.ip` - Client IP address
- `req.id` - Unique request ID for tracing
    
### Production Deployment

For production deployment, consider these best practices:

```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Security first
app.setSecurityHeaders(true);
app.setRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
});
app.setMaxRequestSize(10 * 1024 * 1024); // 10MB

// Add your routes and business logic
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

// Deploy behind reverse proxy (nginx/traefik) for HTTPS
app.listen(process.env.PORT || 3000);
```

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

**Important:** This project maintains zero dependencies. All code must be pure Node.js.

### Limitations

Hasty Server is designed as a lightweight HTTP framework. It does **not** include:

- Middleware system (`app.use()`)
- Built-in authentication
- Built-in database integration
- Built-in input validation
- Built-in session management

For these features, integrate your preferred libraries (Zod for validation, JWT for auth, etc.).

### Changelog

- **v1.0.0** - Production Ready Release
  - Added configurable security headers
  - Implemented rate limiting
  - Added request tracing with unique IDs
  - Fixed CORS credentials bug
  - Improved error handling consistency
  - Replaced console logging with structured logging
  - Added request size limits

- **v0.9.6**
  - Added comprehensive module support (CommonJS, ESM, TypeScript)
  - Added dual package support with automatic module detection


For more information, see .
[CHANGELOG](CHANGELOG.md)

### LICENSE

This project is licensed under LGPL-2.1 - see the [LICENSE](LICENSE.md) file for details.

All rights reserved to the author.
