---
id : quick-start
title: Quick Start
sidebar_position: 2
---

## Quick Start

Welcome to the Quick Start guide for Hasty Server. Follow these steps to get your server up and running quickly.

***Step 1:*** Install Hasty Server
First, you need to install Hasty Server using npm. Run the following command in your terminal:

```js title="npm install hasty-server"
npm install hasty-server
```

***Step 2:*** Create a New Server

```js title="Create a new JavaScript file (e.g., server.js) and add the following code to set up a basic Hasty Server:"
const Hasty = require('hasty-server');
const server = new Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
```

***Step 3:*** Start the Server
Run the following command in your terminal to start the server:

```js title="Run the server"
node server.js
```
Your server should now be running on port 8080. Open your browser and navigate to http://localhost:8080 to see the "Hello World" message.

***Step 4:*** Add More Routes
You can add more routes to your server by using the server.get() or server.post() methods. For example:

```js title="Add more routes to your server"
server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});
```

```js title="Add a POST route to your server"

server.post('/data', (req, res) => {
    res.json({ message: 'Data received!' }));
});
```

This is a basic example to get you started with Hasty Server. For more advanced usage and features, refer to the full documentation.
