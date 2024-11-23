# Test2.js - Hasty Server Test Suite

This test file focuses on testing response status codes and handling different HTTP methods  
on the same route. It addresses Issue #12 which involves "Adding sending of status code with  
response AND handling of different method requests on same route".

## Test Setup

```javascript
const Server = require('../server/index.js')
const server = new Server()
```

## Test Cases

### 1. JSON Response with Status Code
Tests if the server correctly sends JSON responses with appropriate status codes.

```javascript
server.get('/', (req, res) => {
  res.json({ status: 200 })
})
```

### 2. Different HTTP Methods on Same Route
Tests handling of different HTTP methods for the same route ('/hello').

```javascript
server.get('/hello', (req, res) => {
  res.send('Hello from GET request')
})
```

### 3. Chained Status Code with JSON Response
Tests the ability to chain status codes with JSON responses.

```javascript
server.get('/chain-status', (req, res) => {
  res.status(202).json({ message: 'This req has status code of 202' })
})
```

### 4. Server Initialization
Starts the server on port 8080.

```javascript
server.listen(8080, () => {
  // Server starts listening on port 8080
})
```

## Key Testing Aspects

1. **Status Code Handling**
   - Tests proper setting of [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
   - Verifies status code chaining with responses
   - Ensures correct status code transmission

2. **Response Format Testing**
   - Tests [JSON](https://www.json.org/json-en.html) response formatting
   - Verifies content-type headers
   - Checks response body structure

3. **Route Method Handling**
   - Tests different [HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) on same route
   - Verifies correct method-specific responses
   - Ensures proper method routing

## Test Configuration
- Server runs on port 8080
- Uses [HTTP GET method](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) for test routes
- Tests both simple and complex responses
- Includes status code verification

## Notes
- This test file specifically addresses Issue #12
- Tests are focused on response status codes and method handling
- Demonstrates chaining of response methods
- Shows proper route handling for different HTTP methods
        