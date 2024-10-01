# Hasty 

Hasty server is a simple web framework to build webserver  in a simple way. It is inspired by [Express.js](https://expressjs.com/).
Bascially, It is my implementation of HTTP using raw TCP Socket in Javascript.

###  table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Request Object](#request-object)
- [CHANGELOG](CHANGELOG.md)
- [LICENSE](LICENSE.md)


### Note

This is a work in progress and not ready for production. It is just a fun project to learn how HTTP works under the hood.

    -  Currently, It only supports GET and POST request.





### Installation
```bash
npm install hasty-server
```

### Usage  
 
**Common JS**

```Javascript
const Hasty = require('hasty-server');
const  server = new  Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
```
    
**ES6**

```Javascript
import Hasty from 'hasty-server';
const  server = new  Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});
```

### Request Object

Some of the features in  `response object` are:

- `send` : Send a response to the client.
    - Usage: `res.send('Hello World')`

- `json` : Send a JSON response to the client.
    - Usage: `res.json({message: 'Hello World'})`

- `status` : Set the status code of the response.
    - Usage: `res.status(200)`
    - Default status code is 200.

### CHANGELOG
 
 Current version is 0.5.4.
 
 It includes the new feature of  `json` method in the response object.

For more information, see .
[CHANGELOG](CHANGELOG.md)

### LICENSE

This project is licensed under The GPLV3 License - see the [LICENSE.md](LICENSE.md) file for details.
All rights reserved to the author.
```
