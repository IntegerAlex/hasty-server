---
title: Serving Static Files
description: Learn how to serve static files with Hasty Server's basic static file serving capability
---

# 📁 Serving Static Files in Hasty Server

Hasty Server provides basic static file serving functionality. This guide covers what's actually supported.

## What Hasty Server Actually Supports

- Basic static file serving from a directory
- Optional URL prefix for static files
- Directory traversal protection
- Automatic `index.html` serving for directories
- Basic MIME type detection via file extensions

## Basic Static File Serving

To serve static files, use the `static` method:

```javascript
const Hasty = require('hasty-server');
const app = new Hasty();

// Serve files from the 'public' directory
app.static('public');

app.listen(3000);
```

With this setup, files in the `public` directory will be served at the root path. For example:
- `public/index.html` → `http://localhost:3000/index.html`
- `public/css/style.css` → `http://localhost:3000/css/style.css`

## Configuration Options

The `static` method accepts limited configuration options:

```javascript
// Basic usage
app.static('public');

// With URL prefix
app.static('public', { prefix: '/static' });
```

**Available Options:**
- `prefix` (string): URL prefix for static files (default: '/')

**Not Supported:**
- Custom headers or caching configuration
- ETags
- File extension fallbacks
- Custom index files (always uses 'index.html')
- Dotfile handling options
```

## Common Use Cases

### Serving a Single Page Application (SPA)

For SPAs, you'll want to serve the main `index.html` for all routes:

```javascript
const path = require('path');
const fs = require('fs');

// Serve static files from the 'dist' directory
app.static('dist');

// For all other routes, serve the SPA's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

### Serving Multiple Directories

You can serve files from multiple directories by calling `static` multiple times:

```javascript
// Serve public assets
app.static('public');

// Serve user uploads under /uploads path
app.static('uploads', { prefix: '/uploads' });

// Serve documentation under /docs path
app.static('documentation', { 
  prefix: '/docs',
  index: 'index.html'
});
```

### Setting Up a File Download

To force a file to download instead of being displayed in the browser:

```javascript
app.get('/download', (req, res) => {
  res.download('path/to/file.pdf', 'custom-filename.pdf');
});
```

## Security Considerations

### Preventing Directory Traversal

Hasty Server's static file serving is secure against directory traversal attacks by default. It will not allow access to files outside the specified root directory.

### Setting Proper MIME Types

Hasty Server automatically sets the correct MIME types based on file extensions. You can override or extend this behavior:

```javascript
const mime = require('mime-types');

app.static('public', {
  setHeaders: (res, path) => {
    const type = mime.lookup(path) || 'application/octet-stream';
    res.setHeader('Content-Type', type);
  }
});
```

### Disabling Directory Listing

By default, directory listing is disabled. When a directory is requested, Hasty Server will look for an `index.html` file. If not found, it will return a 403 Forbidden response.

## Performance Optimization

### Enabling Compression

To reduce bandwidth and improve load times, enable gzip compression:

```javascript
const zlib = require('zlib');

// Compression middleware
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('gzip')) {
    const gzip = zlib.createGzip();
    res.setHeader('Content-Encoding', 'gzip');
    res.originalWrite = res.write;
    res.originalEnd = res.end;
    
    res.write = function(chunk, encoding, callback) {
      return res.originalWrite.call(this, gzip.write(chunk, encoding), callback);
    };
    
    res.end = function(chunk, encoding, callback) {
      if (chunk) gzip.write(chunk, encoding);
      gzip.flush(() => {
        res.originalEnd.call(this, null, callback);
      });
    };
    
    gzip.pipe(res);
    next();
  } else {
    next();
  }
});

// Now static files will be compressed
app.static('public');
```

### Setting Cache Headers

To improve performance, set appropriate cache headers for static assets:

```javascript
app.static('public', {
  maxAge: '1y', // 1 year
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // Don't cache HTML files
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      // Cache other static assets for 1 year
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
});
```

## Advanced Scenarios

### Virtual Path Prefix

You can serve static files under a virtual path prefix:

```javascript
// Files in 'public' will be served under '/static' path
app.static('public', { prefix: '/static' });
```

Now, `public/css/style.css` will be available at `/static/css/style.css`.

### Custom File Not Found Handling

To customize the 404 response for missing static files:

```javascript
app.static('public');

// Handle 404 for static files
app.use((req, res, next) => {
  if (req.url.startsWith('/static/')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else {
    next();
  }
});
```

### Serving a Single File

To serve a specific file under a different path:

```javascript
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images', 'favicon.ico'));
});
```

## Best Practices

1. **Organize Your Files**: Keep static files in a dedicated directory (commonly `public` or `static`).

2. **Set Proper Cache Headers**: Cache static assets with appropriate expiration times.

3. **Use Content Delivery Networks (CDN)**: For production, consider using a CDN to serve static files.

4. **Enable Compression**: Use gzip or Brotli compression to reduce file sizes.

5. **Implement Security Headers**: Set security headers like `X-Content-Type-Options: nosniff`.

6. **Monitor Performance**: Keep an eye on load times and optimize as needed.

7. **Use Environment Variables**: For different environments (development, production), use environment variables to configure static file serving.

## Example: Complete Static File Server

Here's a complete example of a static file server with various configurations:

```javascript
const Hasty = require('hasty-server');
const path = require('path');
const zlib = require('zlib');
const mime = require('mime-types');

const app = new Hasty();

// Compression middleware
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  
  if (acceptEncoding.includes('gzip')) {
    const gzip = zlib.createGzip();
    res.setHeader('Content-Encoding', 'gzip');
    res.originalWrite = res.write;
    res.originalEnd = res.end;
    
    res.write = function(chunk, encoding, callback) {
      return res.originalWrite.call(this, gzip.write(chunk, encoding), callback);
    };
    
    res.end = function(chunk, encoding, callback) {
      if (chunk) gzip.write(chunk, encoding);
      gzip.flush(() => {
        res.originalEnd.call(this, null, callback);
      });
    };
    
    gzip.pipe(res);
    next();
  } else {
    next();
  }
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve static files with caching
app.static('public', {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html', 'css', 'js', 'json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'],
  index: 'index.html',
  maxAge: '1y',
  setHeaders: (res, path) => {
    // Set MIME type
    const type = mime.lookup(path) || 'application/octet-stream';
    res.setHeader('Content-Type', type);
    
    // Cache control
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Conclusion

Serving static files is a fundamental feature of web servers, and Hasty Server provides a flexible and efficient way to handle this. By following the patterns and best practices outlined in this guide, you can ensure your static assets are served quickly, securely, and efficiently.

For more advanced scenarios, consider exploring middleware for features like authentication, request logging, and rate limiting to build a robust static file server.
