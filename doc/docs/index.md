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
      <a href="/docs/getting-started/quick-start" class="button button--primary">Get Started</a>
      <a href="/docs/guides/why-hasty" class="button button--secondary">Why Hasty?</a>
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
    <p>Middleware support and easy to extend for your specific needs.</p>
  </div>
  <div class="feature">
    <h3>🛠️ Zero Dependencies</h3>
    <p>Built with pure Node.js, no external dependencies required.</p>
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
  res.json({ message: 'Hello, Hasty Server!' });
});

app.listen(3000);
```

## What's Inside?

- **Core HTTP Server**: Built on Node.js native `http` module
- **Routing**: Simple and intuitive route definitions
- **Middleware**: Powerful middleware support
- **Static Files**: Built-in static file serving
- **CORS**: Easy CORS configuration
- **Error Handling**: Robust error handling patterns

## Get Started

- [Quick Start](/docs/getting-started/quick-start) - Get up and running in minutes
- [Guides](/docs/guides) - Learn through practical examples
- [API Reference](/docs/api) - Detailed API documentation
- [Examples](/docs/examples) - Ready-to-run example applications

## Community

Join our growing community of developers!

- [GitHub](https://github.com/yourusername/hasty-server) - Star and contribute
- [Discussions](https://github.com/yourusername/hasty-server/discussions) - Ask questions and share ideas
- [Issues](https://github.com/yourusername/hasty-server/issues) - Report bugs or request features

## License

Hasty Server is [MIT licensed](https://opensource.org/licenses/MIT).
