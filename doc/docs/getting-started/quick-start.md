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

## Request Body Parsing

Since Hasty Server doesn't support middleware, handle request body parsing directly in route handlers:

```javascript
// Handle JSON POST requests
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

## Enabling CORS

To enable CORS for all routes:

```javascript
// Enable CORS for all routes
app.cors(true);

// Note: Hasty Server's CORS implementation is basic
// It enables CORS for all origins and common methods
```

## Serving Static Files

To serve static files (like HTML, CSS, images) from a directory:

```javascript
// Serve files from the 'public' directory
app.static('public');

// Serve with custom prefix
app.static('assets', { prefix: '/static' });

// Note: Hasty Server's static file serving is basic
// Advanced options like caching headers are not supported
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
