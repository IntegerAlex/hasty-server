# Hastier Server

A secure and modern Node.js HTTP server with enhanced security features, built on top of the original [Hasty Server](https://github.com/IntegerAlex/hasty-server).

## Features

- **Enhanced Security**
  - Rate limiting to prevent DoS attacks
  - Security headers (XSS, CSRF, CSP)
  - Path traversal protection
  - CORS support

- **Robust Error Handling**
  - Custom error classes
  - Detailed error messages
  - Request validation

- **Modern API Design**
  - Express-like syntax
  - Method chaining
  - Async/await support

## Quick Start

```bash
# Clone the repository
git clone https://github.com/c4ist/hastier-server.git

# Install dependencies
npm install

# Run tests
npm test
```

## Usage Example

```javascript
const Server = require('./server');
const server = new Server();

server.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hastier Server!' });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Security Features

### Rate Limiting
Protects against DoS attacks by limiting clients to 100 requests per minute:

```javascript
// Rate limiting is enabled by default
const server = new Server({ rateLimit: true });
```

### Security Headers
All responses include essential security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Content-Security-Policy: default-src 'self'`

### CORS Support
Built-in CORS support with customizable options:

```javascript
const server = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
```

## API Documentation

### Server Class
```javascript
const server = new Server(options);
```

Options:
- `rateLimit`: Enable rate limiting (default: true)
- `cors`: CORS configuration object
- `port`: Server port (default: 3000)

### Response Methods
- `res.send(data)`: Send text/HTML response
- `res.json(data)`: Send JSON response
- `res.sendFile(path)`: Send file response
- `res.sendStatus(code)`: Send status code
- `res.setHeaders(headers)`: Set multiple headers

### Request Properties
- `req.method`: HTTP method
- `req.path`: Request path
- `req.headers`: Request headers
- `req.body`: Parsed request body
- `req.query`: Parsed query parameters

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

```bash
npm test
```

## Credits

This project is a security-enhanced fork of [Hasty Server](https://github.com/IntegerAlex/hasty-server) by IntegerAlex. The original project provided the foundation for a lightweight HTTP server, which we've built upon to add modern security features and improved error handling.

## License

This project is licensed under GOFL (Global Opensource softwares Free License) - see the [LICENSE](LICENSE.md)
