---
title: Quick Start
description: Get up and running with Hasty Server in minutes
---

# 🚀 Quick Start

This guide will help you create your first Hasty Server application in just a few minutes.

## Prerequisites

- Node.js 14.x or later
- npm or yarn (for package management)
- Basic knowledge of JavaScript and Node.js

## Installation

1. **Create a new project directory**
   ```bash
   mkdir my-hasty-app
   cd my-hasty-app
   ```

2. **Initialize a new Node.js project**
   ```bash
   npm init -y
   ```

3. **Install Hasty Server**
   ```bash
   npm install hasty-server
   ```
   
   Or if you prefer Yarn:
   ```bash
   yarn add hasty-server
   ```

## Your First Server

Create a new file named `server.js` with the following content:

```javascript
// Import Hasty Server
const Hasty = require('hasty-server');

// Create a new server instance
const app = new Hasty();

// Define routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hasty Server!',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

## Running the Server

Start your server by running:

```bash
node server.js
```

You should see the following output:
```
🚀 Server running on http://localhost:3000
```

## Testing Your Server

Open your web browser and navigate to:
```
http://localhost:3000
```

Or use `curl` to test the API:
```bash
curl http://localhost:3000
```

You should receive a JSON response like this:
```json
{
  "message": "Welcome to Hasty Server!",
  "timestamp": "2025-02-01T11:15:00.000Z"
}
```

## Adding More Routes

Let's add a few more routes to demonstrate Hasty's capabilities:

```javascript
// Simple GET route with parameters
app.get('/greet/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

// POST route with JSON body
app.post('/api/users', (req, res) => {
  // In a real app, you would save this to a database
  const user = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  res.status(201).json(user);
});

// Route with query parameters
app.get('/search', (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  res.json({
    query: q,
    page: Number(page),
    limit: Number(limit),
    results: [] // In a real app, this would contain search results
  });
});
```

## Adding Middleware

Hasty Server supports middleware functions that can process requests before they reach your route handlers:

```javascript
// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Don't forget to call next() to continue to the next middleware/route
});

// JSON body parser middleware
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
```

## Enabling CORS

To enable CORS for all routes:

```javascript
// Enable CORS for all routes
app.cors({
  origin: '*', // Allow all origins (restrict in production!)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

## Serving Static Files

To serve static files (like HTML, CSS, images) from a directory:

```javascript
// Serve files from the 'public' directory
app.static('public', {
  // Optional configuration
  extensions: ['html', 'css', 'js', 'png', 'jpg', 'jpeg', 'gif'],
  index: 'index.html',
  maxAge: '1d' // Cache for 1 day
});
```

## Next Steps

- Learn more about [Routing](/docs/guides/routing)
- Explore the [API Reference](/docs/api)
- Check out [Example Applications](/docs/examples)
- Learn about [Deployment](/docs/guides/deployment)
- Read about [Best Practices](/docs/guides/best-practices)

## Need Help?

If you run into any issues or have questions:

1. Check the [Troubleshooting](/docs/troubleshooting) guide
2. Search the [GitHub Issues](https://github.com/yourusername/hasty-server/issues)
3. [Open a new issue](https://github.com/yourusername/hasty-server/issues/new) if you can't find an answer
