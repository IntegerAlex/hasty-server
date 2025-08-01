---
title: Middleware in Hasty Server
description: Learn how to use and create middleware in Hasty Server to handle requests, modify responses, and more.
---

# 🧩 Middleware in Hasty Server

Middleware functions are a fundamental concept in Hasty Server that allow you to process requests and responses in your application. This guide will show you how to use and create middleware effectively.

## What is Middleware?

Middleware functions have access to:
- The request object (`req`)
- The response object (`res`)
- The next middleware function in the stack (`next`)

Middleware can:
- Execute any code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware in the stack

## Basic Middleware Example

Here's a simple logging middleware:

```javascript
// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware
});
```

## Types of Middleware

### Application-level Middleware

These are bound to the app object using `app.use()`:

```javascript
// This middleware runs for every request
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Mounted at a specific path
app.use('/user/:id', (req, res, next) => {
  console.log('Request Type:', req.method);
  next();
});
```

### Route-level Middleware

These are bound to a specific route:

```javascript
// Middleware function
const logOriginalUrl = (req, res, next) => {
  console.log('Request URL:', req.originalUrl);
  next();
};

// Using the middleware for a specific route
app.get('/user/:id', logOriginalUrl, (req, res) => {
  res.send('User Info');
});
```

### Error-handling Middleware

Error-handling middleware has four arguments instead of three:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## Built-in Middleware

### Static File Serving

Hasty Server includes built-in middleware for serving static files:

```javascript
app.static('public');
```

### Body Parsing

While Hasty Server doesn't include a built-in body parser, you can easily add one:

```javascript
// JSON body parser
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        req.body = data ? JSON.parse(data) : {};
        next();
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
  } else {
    next();
  }
});

// URL-encoded form data parser
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        req.body = {};
        new URLSearchParams(data).forEach((value, key) => {
          req.body[key] = value;
        });
        next();
      } catch (e) {
        res.status(400).json({ error: 'Invalid form data' });
      }
    });
  } else {
    next();
  }
});
```

## Creating Custom Middleware

### Logging Middleware

```javascript
const logger = (options = {}) => {
  return (req, res, next) => {
    const start = Date.now();
    const { method, url } = req;
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const log = `${method} ${url} ${statusCode} - ${duration}ms`;
      
      if (options.logger) {
        options.logger(log);
      } else {
        console.log(log);
      }
    });
    
    next();
  };
};

// Usage
app.use(logger());
```

### Authentication Middleware

```javascript
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer <token>
  
  try {
    // Verify token (using a hypothetical verifyToken function)
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

### Rate Limiting Middleware

```javascript
const rateLimit = (options = {}) => {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options;
  const requests = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const clientIp = req.ip || req.connection.remoteAddress;
    
    if (!requests.has(clientIp)) {
      requests.set(clientIp, []);
    }
    
    // Filter out old requests
    const recentRequests = requests.get(clientIp).filter(time => now - time < windowMs);
    recentRequests.push(now);
    requests.set(clientIp, recentRequests);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recentRequests.length));
    
    if (recentRequests.length > max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json({ 
        error: 'Too many requests, please try again later.' 
      });
    }
    
    next();
  };
};

// Apply to all requests
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
```

## Middleware Execution Order

Middleware functions are executed in the order they are defined. The order is important!

```javascript
// This middleware runs first
app.use((req, res, next) => {
  console.log('First middleware');
  next();
});

// This runs second
app.use((req, res, next) => {
  console.log('Second middleware');
  next();
});

// Route handler
app.get('/', (req, res) => {
  res.send('Hello World');
});
```

## Error Handling Middleware

Error handling middleware is defined with four arguments:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Set status code
  const statusCode = err.statusCode || 500;
  
  // Send error response
  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Using the error handler
app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong!');
  error.statusCode = 400;
  next(error); // Pass to error handler
});
```

## Best Practices

1. **Order Matters**: Place middleware in the correct order. For example, put body parsers before your route handlers.

2. **Use next()**: Always call `next()` unless you're ending the request-response cycle.

3. **Error Handling**: Implement proper error handling middleware.

4. **Reusability**: Create reusable middleware functions for common tasks.

5. **Performance**: Be mindful of middleware performance, especially in production.

6. **Security**: Always validate and sanitize user input in middleware.

7. **Logging**: Implement request logging for debugging and monitoring.

## Common Middleware Patterns

### Request Validation

```javascript
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message 
      });
    }
    next();
  };
};

// Joi schema example
const Joi = require('joi');
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});

// Usage
app.post('/users', validateRequest(userSchema), (req, res) => {
  // Create user
  res.status(201).json({ message: 'User created' });
});
```

### Response Time Header

```javascript
const responseTime = () => {
  return (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      res.setHeader('X-Response-Time', `${duration}ms`);
    });
    
    next();
  };
};

app.use(responseTime());
```

## Conclusion

Middleware is a powerful feature in Hasty Server that allows you to add functionality to your application in a modular and reusable way. By understanding how to create and use middleware effectively, you can build more robust and maintainable applications.

For more advanced middleware patterns and examples, check out the [Advanced Middleware Guide](/docs/advanced/custom-middleware).
