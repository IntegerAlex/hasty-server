# Response Class Documentation

The `Response` class handles HTTP response operations in Hasty Server. It provides methods for sending different types of responses, setting headers, and managing status codes.

## Constructor

```javascript
constructor(socket, enableCors)
```

**Parameters:**
- `socket`: TCP socket connection
- `enableCors`: Boolean flag to enable/disable CORS support

## Properties

### Status Codes
```javascript
statusCode = 200 // Default status code
enableCors = false // Default CORS setting
```

### Status Text Map
Maps HTTP status codes to their standard text descriptions:
```javascript
statusTextMap = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    409: 'Conflict',
    417: 'Expectation Failed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    503: 'Service Unavailable'
}
```

## Methods

### send(data)
Sends a response to the client.

```javascript
response.send('Hello World')
```

**Parameters:**
- `data`: String, Object, Buffer, Stream, null, or undefined
- Automatically sets appropriate Content-Type header
- Supports HTML detection and JSON conversion

### json(data)
Sends a JSON response.

```javascript
response.json({ message: 'Hello World' })
```

**Parameters:**
- `data`: Object to be converted to JSON
- Automatically sets Content-Type to 'application/json'

### status(code)
Sets the HTTP status code for the response.

```javascript
response.status(201)
```

**Parameters:**
- `code`: HTTP status code (must be valid)
**Returns:** Response object (chainable)

### sendStatus(statusCode)
Sends a response with only a status code.

```javascript
response.sendStatus(404)
```

### sendFile(file)
Sends a file as the response.

```javascript
response.sendFile('/path/to/file.txt')
```

**Parameters:**
- `file`: Path to the file
- Automatically sets appropriate Content-Type based on file extension
- Handles file streaming and error cases

### download(file, filename)
Sends a file as an attachment.

```javascript
response.download('/path/to/file.txt', 'download.txt')
```

**Parameters:**
- `file`: Path to the file
- `filename`: Name for the downloaded file
- Sets Content-Disposition header for attachment

### Helper Methods

#### setHeader(key, value)
Sets a response header.

```javascript
response.setHeader('Content-Type', 'text/plain')
```

#### setCorsHeaders()
Sets CORS headers if enabled.
```javascript
// Sets the following headers when CORS is enabled:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
// Access-Control-Allow-Headers: Content-Type, Authorization
```

#### formatHeaders()
Internal method to format headers for HTTP response.

## Example Usage

```javascript
const Response = require('./response.js');

// Basic usage
response.status(200).send('Hello World');

// JSON response
response.json({ message: 'Success' });

// File download
response.download('/path/to/file.txt', 'download.txt');

// Send file with auto content-type
response.sendFile('/path/to/image.png');
```

## Notes

- All response methods automatically end the connection after sending
- Response methods are chainable (except sendFile and download)
- CORS headers are automatically included if enabled
- File operations are handled asynchronously with proper error handling
- Content-Type is automatically detected and set based on the response type
