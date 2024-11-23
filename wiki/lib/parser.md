# HTTP Parser Module Documentation

A lightweight HTTP request parser module that handles parsing of HTTP requests,  
JSON bodies, and query parameters. This module is designed to work with Node.js net servers  
and provides asynchronous parsing capabilities.

## Core Functions

### httpParser(request)

Asynchronously parses HTTP requests into structured objects.

```javascript
async function httpParser(request) {
  const req = new Object()
  const requestString = request.split('\n')
  // ... parsing logic
}
```

**Parameters:**
- `request` (string|Buffer): Raw HTTP request data

**Returns:**
- `Promise<Object>`: Object containing:
  - `method`: HTTP method (GET, POST, etc.)
  - `path`: Request path
  - `version`: HTTP version
  - `body`: Parsed request body (for POST requests)

### JSONbodyParser(body)

Parses JSON-like request bodies into JavaScript objects.

```javascript
function JSONbodyParser(body) {
  const req = body.split('')
  const httpJSON = new Object()
  // ... parsing logic
}
```

**Parameters:**
- `body` (string): JSON-formatted request body

**Returns:**
- `Object`: Parsed JSON object

### HTTPbody(req, pos)

Extracts and processes the HTTP request body.

```javascript
function HTTPbody(req, pos) {
  return new Promise((resolve, reject) => {
    // ... body extraction logic
  })
}
```

**Parameters:**
- `req` (Array<string>): Request lines array
- `pos` (number): Starting position for body extraction

**Returns:**
- `Promise<string>`: Cleaned body content

## Helper Functions

### findFirstBrac(req, target)

Locates the first occurrence of a target character in a string.

```javascript
function findFirstBrac(req, target) {
  for (let i = 0; i < req.length; i++) {
    if (req[i] === target) {
      return i
    }
  }
  return -1
}
```

**Parameters:**
- `req` (string): Input string to search
- `target` (string): Character to find

**Returns:**
- `number`: Index of target character or -1 if not found

### storePair(req, httpJSON)

Stores key-value pairs in a JSON object during parsing.

```javascript
function storePair(req, httpJSON) {
  // ... key-value extraction logic
}
```

**Parameters:**
- `req` (Array<string>): Character array of remaining request
- `httpJSON` (Object): Target object for storing pairs

**Returns:**
- `Array<string>`: Remaining characters after extraction

## Query String Parsing

### queryParser(request)

Parses URL query parameters.

```javascript
function queryParser(request) {
  const req = new Object()
  // ... query parsing logic
}
```

**Parameters:**
- `request` (string): URL containing query string

### storeQuery(query) & queryStorePair(req)

Helper functions for query string parsing.

## Usage Examples

### Basic Request Parsing
```javascript
const httpParser = require('./parser');

// Parse a simple GET request
httpParser("GET /api/users HTTP/1.1\nHost: example.com")
  .then(parsed => console.log(parsed));

// Parse POST request with body
httpParser("POST /api/users HTTP/1.1\nContent-Type: application/json\n\n{\"name\":\"John\"}")
  .then(parsed => console.log(parsed));
```

### Query String Parsing
```javascript
// Parse URL with query parameters
queryParser('https://example.com?key=value&page=1');
```

## Notes

- Handles both GET and POST requests
- Supports JSON body parsing
- Asynchronous body parsing with Promises
- Query string parameter extraction
- Removes whitespace and quotes from body content
- Compatible with Node.js net module
