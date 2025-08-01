---
title: Introduction
description: A lightweight, educational HTTP server framework built with Node.js
slug: / 
docs: true
---

# Hasty Server

<div class="hero">
  <div class="hero-content">
    <h1>Build Fast. Learn More.</h1>
    <p class="subtitle">A lightweight, educational HTTP server framework built with Node.js</p>
    <div class="cta-buttons">
      <a href="./getting-started/quick-start" class="button button--primary">Get Started</a>
      <a href="./guides" class="button button--secondary">Explore the Docs</a>
    </div>
  </div>
</div>

## Why Choose Hasty Server?

<div class="features">
  <div class="feature">
    <h3>🚀 Simple & Fast</h3>
    <p>Minimal overhead with a clean, intuitive API that gets out of your way.</p>
  </div>
  <div class="feature">
    <h3>🎓 Educational</h3>
    <p>Designed to help you understand how web servers work under the hood.</p>
  </div>
  <div class="feature">
    <h3>🔌 Extensible</h3>
    <p>Middleware support- **Educational**: Designed for learning HTTP server fundamentals.</p>
  </div>
  <div class="feature">
    <h3>🛠️ Zero Dependencies</h3>
    <p>Built with pure Node.js, no external dependencies required.</p>
  </div>
</div>

## Explore the Docs

<div class="doc-grid">
  <div class="doc-card">
    <h4>📚 Guides</h4>
    <p>Learn how to use Hasty Server effectively</p>
    <a href="./guides/routing">Routing Guide →</a>
  </div>
  
  <div class="doc-card">
    <h4>📁 Static Files</h4>
    <p>Serve static assets with Hasty Server</p>
    <a href="./guides/static-files">Static Files →</a>
  </div>
  
  <div class="doc-card">
    <h4>⚠️ Limitations</h4>
    <p>Understand what Hasty Server does NOT support</p>
    <a href="./guides/limitations">Limitations →</a>
  </div>
</div>

## Quick Start

```bash
# Install Hasty Server
npm install hasty-server

# Create a simple server
const Hasty = require('hasty-server');
const app = new Hasty();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Hasty Server!' });
});

app.listen(3000);
```

## What's Inside?

- **Core HTTP Server**: Built on Node.js native `http` module
- **Routing**: Simple and intuitive route definitions
- **Educational**: Designed for learning HTTP server fundamentals
- **Static Files**: Built-in static file serving
- **CORS**: Easy CORS configuration
- **Error Handling**: Robust error handling patterns

## Get Started

- [Quick Start](./getting-started/quick-start) - Get up and running in minutes
- [Routing Guide](./guides/routing) - Understand route handling
- [Static Files Guide](./guides/static-files) - Serve static assets
- [Limitations Guide](./guides/limitations) - Understand what Hasty Server does NOT support

## Community

Join our growing community of developers!

- [GitHub](https://github.com/yourusername/hasty-server) - Star and contribute
- [Discussions](https://github.com/yourusername/hasty-server/discussions) - Ask questions and share ideas
- [Issues](https://github.com/yourusername/hasty-server/issues) - Report bugs or request features

## License

Hasty Server is [MIT licensed](https://opensource.org/licenses/MIT).
