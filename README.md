# Hasty 

Hasty server is a simple web framework to build webserver  in a simple way. It is inspired by [Express.js](https://expressjs.com/).
Bascially, It is my implementation of HTTP using raw TCP Socket in Javascript.

###  table of contents
- [Installation](#installation)
- [Usage](#usage)


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
    console.log('Server is running on port 3000');
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
    console.log('Server is running on port 3000');
});
```

