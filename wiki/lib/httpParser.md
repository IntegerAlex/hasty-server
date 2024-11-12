# HTTP Parser Documentation

## Overview
The `httpParser` is a JavaScript module that parses raw HTTP requests into structured objects.  
It handles different HTTP methods (GET, POST, etc.), parses headers, query parameters, and request bodies.

## Installation
The httpParser is an internal module of hasty-server, so it's included when you install hasty-server:

```bash
npm install hasty-server
```

## Usage

### Basic Usage
```javascript
const { httpParser } = require('./lib/httpParser');

// Parse an HTTP request
async function handleRequest(rawRequest) {
    const parsedRequest = await httpParser(rawRequest);
    console.log(parsedRequest);
}
```

### Example Response Object
```javascript
// GET request example
{
    method: 'GET',
    path: '/users',
    version: 'HTTP/1.1',
    query: {
        page: '1',
        limit: '10'
    }
}

// POST request example
{
    method: 'POST',
    path: '/users',
    version: 'HTTP/1.1',
    query: {},
    body: {
        name: 'John',
        age: 30
    }
}
```

## Features

1. **Method Parsing**: Automatically detects and parses HTTP methods (GET, POST, PUT, DELETE, etc.)
2. **Query String Parsing**: Parses URL query parameters into an object
3. **Body Parsing**: Handles JSON request bodies for POST requests
4. **Header Parsing**: Parses HTTP headers into a structured format
5. **Async Operation**: Returns a Promise for handling asynchronous parsing

## Example with Different Request Types

```javascript
const { httpParser } = require('./lib/httpParser');

// GET request with query parameters
const getRequest = `GET /api/users?page=1&limit=10 HTTP/1.1
Host: localhost:3000
Accept: application/json

`;

// POST request with JSON body
const postRequest = `POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com"
}`;

async function examples() {
    // Parse GET request
    const parsedGet = await httpParser(getRequest);
    console.log('Parsed GET:', parsedGet);

    // Parse POST request
    const parsedPost = await httpParser(postRequest);
    console.log('Parsed POST:', parsedPost);
}
```

## Look how this works behind the scenes



```javascript
// Parse the request line (first line of the headers)
const requestLine = headers[0].split(' ') // ["POST", "/path", "HTTP/1.1"]
req.method = requestLine[0] // e.g., "POST"
req.path = requestLine[1]   // e.g., "/path"
req.version = requestLine[2] // e.g., "HTTP/1.1"
```

This code handles the first line of an HTTP request, which follows this standard format:  
`METHOD PATH HTTP_VERSION`

For example: `POST /users HTTP/1.1`

Here's what each line does:

1. `headers[0].split(' ')` - Takes the first line of the request and splits it into an array using spaces as separators
   - Example input: `"POST /users HTTP/1.1"`
   - Result: `["POST", "/users", "HTTP/1.1"]`

2. `req.method = requestLine[0]` - Stores the HTTP method (GET, POST, PUT, etc.)
   - Gets the first element: `"POST"`

3. `req.path = requestLine[1]` - Stores the requested path/URL
   - Gets the second element: `"/users"`

4. `req.version = requestLine[2]` - Stores the HTTP protocol version
   - Gets the third element: `"HTTP/1.1"`

This parsing is essential for the server to understand:
- What type of request it is (method)
- Where the request is going (path)
- What version of HTTP to use (version)
        

## Error Handling

```javascript
try {
    const parsedRequest = await httpParser(rawRequest);
    // Handle successful parsing
} catch (error) {
    console.error('Error parsing request:', error);
    // Handle parsing error
}
```

## Internal Methods Used

- `queryParser`: Parses URL query parameters
- `JSONbodyParser`: Parses JSON request bodies
- `findFirstBrac`: Utility for finding specific characters in the request
- `HTTPbody`: Handles HTTP body parsing

## Notes

1. The parser expects properly formatted HTTP requests
2. For POST requests, it automatically attempts to parse JSON bodies
3. Query parameters are automatically parsed for all request types
4. The parser is promise-based to handle asynchronous operations
5. Invalid requests may throw errors that should be handled appropriately

This documentation is based on the current implementation shown in the context files, particularly the httpParser.js and related utility files.