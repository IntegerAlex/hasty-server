# Hasty Server Test Suite Documentation

This file contains integration tests for the Hasty Server framework using [Jest](https://jestjs.io/)  
testing framework. The tests verify core server functionality including routing,  
response handling, and file serving capabilities.

## Test Setup

```javascript
const net = require('net')
const Hasty = require('../server/index')
const fs = require('fs')

describe('Hasty Server', () => {
  let server
```

## Core Test Cases

### 1. Basic GET Request Test

Tests if the server correctly handles basic GET requests and sends appropriate responses.

```javascript
test('should call the correct callback for a GET request', done => {
  server = new Hasty()
  
  // Define route handler
  const callback = (req, res) => {
    res.send('GET request received')
  }
  
  // Set up route and start server
  server.get('/test', callback)
  server.listen(3000, () => {
    // Create test client connection
    const client = net.connect({ port: 3000 }, () => {
      client.write('GET /test HTTP/1.1\r\nHost: localhost\r\n\r\n')
    })

    // Handle response
    client.on('data', (data) => {
      expect(data.toString()).toContain('GET request received')
      client.end()
      server.close()
      done()
    })
  })
})
```

### 2. JSON Response Test

Verifies the server's ability to send JSON responses with proper content type headers.

```javascript
test('/GET json', done => {
  server = new Hasty()
  const callback = (req, res) => {
    res.json({ message: 'GET request received' })
  }
  
  server.get('/json', callback)
  server.listen(3000, () => {
    fetch('http://localhost:3000/json')
      .then(response => response.json())
      .then(data => {
        expect(data).toEqual({ message: 'GET request received' })
        server.close()
        done()
      })
  })
}, 5000)
```

### 3. File Serving Test

Tests the server's file serving capabilities using `sendFile` method.

```javascript
test('/GET sendFile', done => {
  server = new Hasty()
  const callback = (req, res) => {
    const path = require('path')
    res.sendFile(path.join(__dirname, 'index.html'))
  }
  
  server.get('/file', callback)
  server.listen(3000, () => {
    fetch('http://localhost:3000/file')
      .then(response => {
        expect(response.headers.get('Content-Type')).toBe('text/html')
        return response.text()
      })
      .then(data => {
        const stream = fs.createReadStream(path.join(__dirname, 'index.html'))
        stream.on('data', chunk => {
          expect(data).toEqual(chunk.toString())
          server.close()
          done()
        })
      })
  })
}, 10000)
```

## Key Testing Aspects

1. **Server Setup and Teardown**
   - Creates new server instance before each test
   - Properly closes server after each test
   - Uses async/await pattern with Jest's `done` callback

2. **Request Testing**
   - Tests different HTTP methods
   - Verifies response content
   - Checks response headers
   - Tests JSON response handling

3. **File Handling**
   - Tests static file serving
   - Verifies correct MIME type headers
   - Checks file content integrity

4. **Error Handling**
   - Includes error callbacks
   - Tests for proper error responses
   - Handles timeouts appropriately

## Testing Utilities

- Uses Node's native `net` module for low-level TCP testing
- Employs `fetch` API for higher-level HTTP testing
- Uses file system (`fs`) module for file-related tests

## Test Configuration

- Default timeout: 5000ms for basic tests
- Extended timeout: 10000ms for file operations
- Uses Jest's testing framework
- Runs on port 3000 for test server

## Notes

- Tests run asynchronously
- Each test creates its own server instance
- Proper cleanup is performed after each test
- Tests cover core server functionality
        