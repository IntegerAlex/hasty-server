---
title: Routing in Hasty Server
description: Learn how to define and manage routes in your Hasty Server application
---

# 🛣️ Routing in Hasty Server

Routing refers to how an application's endpoints (URIs) respond to client requests. This guide covers everything you need to know about routing in Hasty Server.

## Basic Routing

Hasty Server provides simple methods to define routes that respond to different HTTP methods.

### Basic GET Route

```javascript
app.get('/about', (req, res) => {
  res.send('About Page');
});
```

### All HTTP Methods

Hasty Server supports all standard HTTP methods:

```javascript
// GET method route
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

// POST method route
app.post('/users', (req, res) => {
  // Create a new user
  res.status(201).json({ id: 2, ...req.body });
});

// PUT method route
app.put('/users/:id', (req, res) => {
  // Update the user
  res.json({ id: req.params.id, ...req.body });
});

// DELETE method route
app.delete('/users/:id', (req, res) => {
  // Delete the user
  res.status(204).end();
});

// PATCH method route
app.patch('/users/:id', (req, res) => {
  // Partially update the user
  res.json({ id: req.params.id, ...req.body });
});

// OPTIONS method route
app.options('/users', (req, res) => {
  res.setHeader('Allow', 'GET, POST, OPTIONS');
  res.status(200).end();
});

// HEAD method route
app.head('/users/:id', (req, res) => {
  // Similar to GET but without the response body
  res.status(200).end();
});
```

## Route Parameters

### Basic Parameters

```javascript
// Route with required parameter
app.get('/users/:userId', (req, res) => {
  res.send(`User ID: ${req.params.userId}`);
});

// Route with multiple parameters
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  res.json({
    postId: req.params.postId,
    commentId: req.params.commentId
  });
});
```

### Optional Parameters

```javascript
// Optional parameter with ?
app.get('/users/:userId?', (req, res) => {
  if (req.params.userId) {
    res.send(`User ID: ${req.params.userId}`);
  } else {
    res.send('All users');
  }
});
```

### Regular Expression in Routes

```javascript
// Only match 4-digit years
app.get('/articles/:year(\\d{4})', (req, res) => {
  res.send(`Articles from year: ${req.params.year}`);
});

// Match a specific format
app.get('/download/:file(*.jpg|*.png|*.gif)', (req, res) => {
  res.download(`./assets/images/${req.params.file}`);
});
```

## Route Handlers

### Multiple Callback Functions

You can provide multiple callback functions that behave like middleware to handle a request.

```javascript
const checkAuth = (req, res, next) => {
  if (req.headers.authorization) {
    next(); // Pass control to the next handler
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/dashboard', checkAuth, (req, res) => {
  res.send('Welcome to your dashboard!');
});
```

### Array of Callback Functions

```javascript
const logRequest = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

const requireAuth = (req, res, next) => {
  if (req.headers.authorization === 'secret-token') {
    next();
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.get('/api/secure', [logRequest, requireAuth], (req, res) => {
  res.json({ secret: 'This is protected data' });
});
```

## Route Paths

### String Patterns

```javascript
// This route path will match requests to /about
app.get('/about', (req, res) => {
  res.send('about');
});

// This route path will match acd and abcd
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
});

// This route path will match abcd, abbcd, abbbcd, and so on
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd');
});

// This route path will match abcd, abxcd, abRANDOMcd, ab123cd, etc.
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd');
});

// This route path will match /abe and /abcde
app.get('/ab(cd)?e', (req, res) => {
  res.send('ab(cd)?e');
});
```

## Route Methods

### app.all()

This method is used to load middleware functions at a path for all HTTP request methods.

```javascript
// This will be executed for all types of HTTP requests to /secret
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section...');
  next(); // pass control to the next handler
});
```

## Response Methods

Hasty Server's response object (`res`) provides several methods to send a response to the client.

### res.send()

Sends a response of various types.

```javascript
res.send(Buffer.from('whoop'));
res.send({ some: 'json' });
res.send('<p>some html</p>');
res.status(404).send('Sorry, we cannot find that!');
res.status(500).send({ error: 'something went wrong' });
```

### res.json()

Sends a JSON response.

```javascript
res.json(null);
res.json({ user: 'tobi' });
res.status(500).json({ error: 'message' });
```

### res.download()

Prompts a file to be downloaded.

```javascript
res.download('/report-12345.pdf');
res.download('/report-12345.pdf', 'report.pdf');
res.download('/report-12345.pdf', 'report.pdf', (err) => {
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {
    // decrement a download credit, etc.
  }
});
```

## Best Practices

1. **Organize Routes**
   - Group related routes together
   - Consider using the Router for larger applications

2. **Use Route Parameters**
   - Make your URLs clean and RESTful
   - Use parameters for resource identifiers

3. **Handle Errors**
   - Always handle errors in your route handlers
   - Use try/catch for async operations

4. **Validate Input**
   - Always validate and sanitize user input
   - Return appropriate error messages

5. **Use Middleware**
   - Extract common functionality into middleware
   - Keep route handlers focused on their specific task

## Advanced Routing

### Route Groups with Router

For larger applications, you can use the Router to create modular, mountable route handlers.

```javascript
// routes/users.js
const Hasty = require('hasty-server');
const router = new Hasty.Router();

// Middleware specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

// Define the home page route
router.get('/', (req, res) => {
  res.send('Users home page');
});

// Define the about route
router.get('/about', (req, res) => {
  res.send('About users');
});

module.exports = router;

// In your main app file
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### 404 Handling

To handle 404 errors (routes that don't match any defined route), add this at the end of all your routes:

```javascript
// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    status: 404
  });
});
```

### Error Handling

Handle errors in your route handlers:

```javascript
app.get('/error', (req, res, next) => {
  try {
    // Simulate an error
    throw new Error('Something went wrong!');
  } catch (err) {
    // Pass errors to Express
    next(err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});
```

## Performance Tips

1. **Route Order Matters**
   - Place specific routes before more general ones
   - Place frequently accessed routes first

2. **Use Route Caching**
   - Cache responses for static or infrequently changing data

3. **Minimize Middleware**
   - Only use necessary middleware
   - Consider conditionally applying middleware

4. **Use Route Parameters**
   - More efficient than parsing query strings for resource identifiers

## Common Patterns

### RESTful Routes

```javascript
// GET /posts - Get all posts
app.get('/posts', (req, res) => {
  // Return all posts
});

// POST /posts - Create a new post
app.post('/posts', (req, res) => {
  // Create a new post
});

// GET /posts/:id - Get a specific post
app.get('/posts/:id', (req, res) => {
  // Return the specified post
});

// PUT /posts/:id - Update a specific post
app.put('/posts/:id', (req, res) => {
  // Update the specified post
});

// DELETE /posts/:id - Delete a specific post
app.delete('/posts/:id', (req, res) => {
  // Delete the specified post
});
```

### File Upload Routes

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  // req.file is the 'file' file
  // req.body will hold the text fields, if there were any
  res.json({
    success: true,
    file: req.file,
    fields: req.body
  });
});
```

## Conclusion

Hasty Server provides a powerful and flexible routing system that can handle everything from simple to complex routing needs. By following the patterns and best practices outlined in this guide, you can create well-structured and maintainable applications.
