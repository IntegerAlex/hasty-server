---
id: hello-world-with-hasty-server
title: Hello World example
sidebar_position: 3
---

## Hello World with Hasty Server

Hasty Server allows you to quickly set up a web server. Below is a simple example of how to create a "Hello World" server.

Example

 Import Hasty Server
```js 
const Hasty = require('hasty-server');
```
```js title="Create a new Hasty server instance"
const server = new Hasty();
```

```js title="Define a route for GET requests to the root URL"
server.get('/', (req, res) => {
  console.log('GET /');
  res.send('Hello, World!');
});
```

```js title="Start the server and listen on port 8080"
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
```
        
The code above sets up a basic server using the Hasty framework. When a `GET` request is made to the root (`/`) URL, it logs the request to the console and responds with "Hello, World!".

Running the Server
To run this server, save the above code in a file, for example, server.js, and then run the following command in your terminal:

```js title="Run the server"
$ node server.js
```

Open your browser and navigate to localhost:8080. You should see the "Hello, World!" message.
