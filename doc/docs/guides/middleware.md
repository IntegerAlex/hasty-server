---
title: Request Processing in Hasty Server
description: Learn how Hasty Server processes requests and how to implement custom logic in route handlers
---

# ⚙️ Request Processing in Hasty Server

**Important Note**: Hasty Server does NOT implement Express-style middleware (`app.use()` method). This guide covers what Hasty Server actually supports for request processing.

## What Hasty Server Actually Supports

Hasty Server provides:
- Route-specific handlers for HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Static file serving via `app.static()`
- CORS support via `app.cors()`
- Route parameters (e.g., `/users/:id`)
- Request and response objects with basic functionality

## Route Handlers

Each route handler receives `req` and `res` objects:

```javascript
app.get('/users/:id', (req, res) => {
  // Access route parameters
  const userId = req.params.id;
  
  // Access request properties
  console.log(`${req.method} ${req.path}`);
  
  // Send response
  res.json({ id: userId, name: 'John Doe' });
});
```

## Request Processing Patterns

### Logging Requests

Since Hasty Server doesn't have middleware, implement logging in each route handler:

```javascript
const logRequest = (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
};

app.get('/users', (req, res) => {
  logRequest(req);
  res.json([{ id: 1, name: 'Alice' }]);
});

app.post('/users', (req, res) => {
  logRequest(req);
  // Handle POST request
  res.status(201).json({ id: 2, name: 'Bob' });
});
```

### Request Body Parsing

Handle request body parsing manually in route handlers:

```javascript
app.post('/users', (req, res) => {
  if (req.headers['content-type'] === 'application/json') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        const body = JSON.parse(data);
        // Process the parsed body
        res.status(201).json({ id: Date.now(), ...body });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    res.status(400).json({ error: 'Content-Type must be application/json' });
  }
});
```

## Built-in Features

### Static File Serving

Hasty Server includes built-in static file serving:

```javascript
// Serve files from 'public' directory
app.static('public');

// Serve with custom prefix
app.static('assets', { prefix: '/static' });
```

### CORS Support

Enable CORS for all routes:

```javascript
// Enable CORS
app.cors(true);

// CORS is now handled automatically for all routes
app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS enabled' });
});
```

## Custom Request Processing Functions

Since Hasty Server doesn't support middleware, create reusable functions for common tasks:

### Authentication Helper

```javascript
const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  // Verify token (implement your own verification logic)
  if (token !== 'valid-token') {
    throw new Error('Invalid token');
  }
  
  return { id: 1, name: 'User' };
};

// Use in route handlers
app.get('/profile', (req, res) => {
  try {
    const user = authenticate(req);
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});
```

### Request Validation Helper

```javascript
const validateUserData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.length < 3) {
    errors.push('Name must be at least 3 characters');
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }
  
  return errors;
};

// Use in POST route
app.post('/users', (req, res) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    try {
      const userData = JSON.parse(data);
      const errors = validateUserData(userData);
      
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      
      // Process valid user data
      res.status(201).json({ id: Date.now(), ...userData });
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
});
```

## Error Handling

Handle errors directly in route handlers using try/catch:

```javascript
app.get('/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    // Simulate finding user
    if (userId !== 1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ id: userId, name: 'John Doe' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Async Error Handling

For async operations, use async/await with try/catch:

```javascript
app.get('/async-data', async (req, res) => {
  try {
    // Simulate async operation
    const data = await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ message: 'Async data loaded' });
      }, 100);
    });
    
    res.json(data);
  } catch (error) {
    console.error('Async error:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
});
```

## Best Practices

1. **Create Reusable Functions**: Extract common logic into helper functions that can be used across route handlers.

2. **Handle Errors Consistently**: Use try/catch blocks in all route handlers and return consistent error responses.

3. **Validate Input**: Always validate and sanitize user input in route handlers.

4. **Log Requests**: Implement logging in route handlers for debugging and monitoring.

5. **Use Async/Await**: For async operations, use async/await with proper error handling.

6. **Keep Routes Simple**: Keep route handlers focused on their specific task.

## Known Limitations

- **No Middleware System**: Hasty Server does not support Express-style middleware (`app.use()` method)
- **No Router**: No separate router class for organizing routes
- **Manual Body Parsing**: Request body parsing must be implemented manually in each route
- **No Built-in Authentication**: Authentication logic must be implemented in route handlers
- **No Request/Response Interceptors**: No way to globally intercept or modify requests/responses

## Example: Complete Request Processing Setup

Here's how to implement common request processing patterns without middleware:

```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Enable CORS
app.cors(true);

// Serve static files
app.static('public');

// Helper functions
const logRequest = (req) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
};

const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    if (req.headers['content-type'] !== 'application/json') {
      return reject(new Error('Content-Type must be application/json'));
    }
    
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
  });
};

// Routes with request processing
app.get('/users', (req, res) => {
  logRequest(req);
  res.json([{ id: 1, name: 'Alice' }]);
});

app.post('/users', async (req, res) => {
  logRequest(req);
  
  try {
    const body = await parseJsonBody(req);
    
    // Validate required fields
    if (!body.name || !body.email) {
      return res.status(400).json({ 
        error: 'Name and email are required' 
      });
    }
    
    // Create user (simulate)
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Conclusion

While Hasty Server doesn't support Express-style middleware, you can still implement robust request processing using helper functions and consistent error handling patterns. This approach keeps the framework simple while allowing you to build functional web applications.
