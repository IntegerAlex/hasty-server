# Hasty Server Internal Documentation

## Project Architecture

### Core Components
1. **Server Class** - Main server implementation [wiki/server.md](server/index.md)  or [server/index.js](../server/index.js)
2. **Response Class** - Handles HTTP response formatting [wiki/server/response.md](server/response.md) or [server/response.js](../server/response.js)
3. **HTTP Parser** - Custom HTTP request parsing implementation [wiki/lib/httpParser.md](lib/httpParser.md) or [lib/httpParser.js](../lib/httpParser.js)
4. **Socket Handler** - TCP socket management

## Internal Libraries

### MIME Database
Located in [wiki/lib/mimeDB.md](lib/mimeDB.md)
- Handles file type detection
- Maps file extensions to MIME types
- Used for proper Content-Type header setting

### Utility Functions
Located in [wiki/lib/utils.md](lib/utils.md)
- HTTP body parsing
- Query parameter parsing
- MIME type lookups
- String manipulation utilities

## Implementation Details

### HTTP Parser
- Custom implementation without dependencies
- Handles both GET and POST requests
- Parses headers, query parameters, and body content
- Supports JSON parsing

### Response Handling
- Chainable response methods
- Supports multiple response types (JSON, files, text)
- Automatic MIME type detection for file responses
- Built-in error handling

### Routing System
- Support for multiple HTTP methods (GET, POST, PUT, DELETE, PATCH, etc.)
- Path parameter extraction
- Query string parsing
- Route handler management

## Development Guidelines

### Adding New Features
1. Maintain zero-dependency philosophy
2. Follow existing code structure
3. Add appropriate documentation
4. Include test cases

### Testing
- Unit tests for core components
- Integration tests for request/response cycle
- Performance benchmarks

## Performance Considerations
- TCP socket optimization
- Memory management
- Request parsing efficiency
- Response streaming

## Security Implementation
- Built-in CORS support
- Header sanitization
- Request validation
- Error handling security
