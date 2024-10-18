# Hasty 

![NPM Version](https://img.shields.io/npm/v/hasty-server)
![NPM Downloads](https://img.shields.io/npm/d18m/hasty-server)
![NPM License](https://img.shields.io/npm/l/hasty-server)

Hasty server is a simple web framework to build webserver  in a simple way. It is inspired by [Express.js](https://expressjs.com/).
Bascially, It is my implementation of HTTP using raw TCP Socket in Javascript.

###  table of contents
- [Installation](#installation)
- [Usage](#usage)
- [Request Object](#request-object)
- [Contributing](#contributing)
- [CHANGELOG](CHANGELOG.md)
- [LICENSE](LICENSE.md)


### Note

This is a work in progress and not ready for production. It is just a fun project to learn how HTTP works under the hood.

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
    
### Contributing

If you would like to contribute to Hasty Server, you're welcome to:

 - Fork the repository.
 - Create a branch for your feature or bugfix.
 - Submit a pull request.
 - Please make sure to read the [contribution guidelines](CONTRIBUTING.md) for more details.

Note: Do not use third-party code or dependencies. You can take help from language models, but avoid directly copying any of their code.

### CHANGELOG
 -  v0.8.0 
    - Added `download()` method to send file as an attachment.
    - Added `server.cors(true)` to enable `cors`.

For more information, see .
[CHANGELOG](CHANGELOG.md)

### LICENSE

This project is licensed under GOFL (Global Opensource softwares Free License) and  GPL-v3 (General Public License) - see the [LICENSE](LICENSE.md) and [GPL-v3](GPLV3.md)file for details.

```
All rights reserved to the author.
```
