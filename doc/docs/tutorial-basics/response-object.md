---
id: response-object
title: Response Object
sidebar_position: 3
---

## Response Object  

The `res` or `response` object is an instance of the `Response` class. It is used to send responses to the client. The `res` and `response` object has several methods to send different types of responses.

**Note:**
 - The `res` object is the second argument passed to the route handler function. 
 - The `response` maybe referred to as `res` or `response` in the code examples.

```js title="res object"
server.get('/', (request, response) => {
  response.send('Hello, World!');
});
```

### methods

#### `res.send(data: string | object | Buffer | Stream | null | undefined)`
Sends a response to the client. The `data` parameter can be a string, object, Buffer, Stream, null, or undefined.

```js title="res.send example"
server.get('/', (request, response) => {
  response.send('Hello, World!');
});
```
response.send can be used to send HTML.

```js title="res.send HTML example"
server.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>');
});
```

#### `res.sendStatus(code: number)`
Sends a response with the specified status code. The `code` parameter is the status code to be sent.

```js title="res.sendStatus example"
server.get('/', (request, response) => {
  response.sendStatus(200);
});
```

#### `res.status(code: number)`
Sets the status code of the response. The `code` parameter is the status code to be set.

```js title="res.status example"
server.get('/', (request, response) => {
  response.status(200).send('Hello, World!');
});
```

#### `res.json(data: object)`
Sends a JSON response to the client. The `data` parameter must be an object.

```js title="res.json example"
server.get('/', (request, response) => {
  response.json({ message: 'Hello, World!' });
});
```
**Note:** The `res.json` method automatically sets the `Content-Type` header to `application
/json`.

#### `res.sendFile(path: string)`
Sends a file in the response. The `path` parameter is the path to the file to be sent.
It sets the `Content-Type` header based on the file extension.
note: The path is relative to the root directory of the application.
it does not send file as  an attachment. for that  use `res.download` method.

```js title="res.sendFile example"
server.get('/', (request, response) => {
  response.sendFile('path/to/file.txt');
});
```

#### `res.download(path: string, filename: string)`
Sends a file as an attachment with the specified filename. The `path` parameter is the path to the file to be sent, and the `filename` parameter is the name of the file to be sent.

```js title="res.download example"
server.get('/', (request, response) => {
  response.download('path/to/file.txt', 'file.txt');
});
```


