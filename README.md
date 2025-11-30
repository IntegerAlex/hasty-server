# Hasty 
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/IntegerAlex/hasty-server/badge)](https://scorecard.dev/viewer/?uri=github.com/IntegerAlex/hasty-server)
![NPM Version](https://img.shields.io/npm/v/hasty-server)
![NPM Downloads](https://img.shields.io/npm/d18m/hasty-server)
![NPM License](https://img.shields.io/npm/l/hasty-server)
 
**Help needed**: I am looking for contributors to help me with this project. If you are interested, please let me know.

Hasty server is a simple web framework to build webserver  in a simple way. It is inspired by [Express.js](https://expressjs.com/).
Bascially, It is my implementation of HTTP using raw TCP Socket in Javascript.

###  table of contents
- [Installation](#installation)
- [Module Support](#module-support)
- [Usage](#usage)
- [Request Object](#request-object)
- [Contributing](#contributing)
- [CHANGELOG](CHANGELOG.md)
- [LICENSE](LICENSE.md)


### Note

This project has been upgraded to be **Production Ready**. It supports:
-   **Robust Body Parsing**: Handles fragmented packets and large payloads.
-   **HTTP Keep-Alive**: Persistent connections for high performance.
-   **CORS Support**: Full CORS handling including preflight and credentials.
-   **HTTP 1.1 Compliance**: Fully compliant with GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS.
-   **Battle Tested**: Verified against edge cases, slowloris attacks, and protocol abuse.

It is a great tool to learn how HTTP works under the hood while being robust enough for real-world API usage.

### Installation
```bash
npm install hasty-server
```

### Module Support

Hasty Server supports multiple module systems for maximum compatibility:

#### ✅ CommonJS (Default)

```javascript
const Hasty = require('hasty-server');
const server = new Hasty();
```

#### ✅ ES Modules (ESM)

```javascript
import Hasty from 'hasty-server';
const server = new Hasty();
```

#### ✅ TypeScript

```typescript
import Hasty, { Request, Response } from 'hasty-server';

const server = new Hasty();

server.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from TypeScript!' });
});
```

#### ✅ Dual Package Support

The framework automatically detects your module system and provides the appropriate format:

- **CommonJS projects**: Uses `.js` files
- **ESM projects**: Uses `.mjs` files  
- **TypeScript projects**: Uses `.d.ts` type definitions

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

**TypeScript**

```typescript
import Hasty, { Request, Response } from 'hasty-server';

const server = new Hasty();

server.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from TypeScript!' });
});

server.post('/api/users', (req: Request, res: Response) => {
    const userData = req.body;
    res.status(201).json({ id: 1, ...userData });
});

server.listen(8080, () => {
    console.log('TypeScript server running on port 8080');
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
 -  v0.9.6 
    - Added comprehensive module support (CommonJS, ESM, TypeScript)
    - Added dual package support with automatic module detection


For more information, see .
[CHANGELOG](CHANGELOG.md)

### LICENSE

This project is licensed under LGPL-2.1 - see the [LICENSE](LICENSE.md) file for details.

All rights reserved to the author.
