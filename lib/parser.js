/**
 * Custom error class for HTTP parsing errors
 */
class HTTPParseError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'HTTPParseError';
    this.statusCode = statusCode;
  }
}

/**
 * Validates HTTP request data
 * @param {Object} data - Parsed HTTP request data
 * @throws {HTTPParseError} If validation fails
 */
function validateRequest(data) {
  if (!data.method) {
    throw new HTTPParseError('Missing HTTP method', 400);
  }

  if (!data.path) {
    throw new HTTPParseError('Missing request path', 400);
  }

  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  if (!validMethods.includes(data.method)) {
    throw new HTTPParseError(`Invalid HTTP method: ${data.method}`, 405);
  }

  // Validate path format
  if (!data.path.startsWith('/')) {
    throw new HTTPParseError('Path must start with /', 400);
  }

  // Basic path traversal protection
  if (data.path.includes('..')) {
    throw new HTTPParseError('Invalid path: potential directory traversal', 400);
  }
}

/**
 * Parse HTTP request body
 * @param {string} body - Raw HTTP request body
 * @returns {Object} Parsed body data
 * @throws {HTTPParseError} If body parsing fails
 */
function parseBody(body) {
  try {
    return body ? JSON.parse(body) : {};
  } catch (error) {
    throw new HTTPParseError('Invalid JSON in request body', 400);
  }
}

/**
 * Parse raw HTTP request data
 * @param {string} buff - Raw HTTP request data
 * @returns {Promise<Object>} Parsed request data
 * @throws {HTTPParseError} If parsing fails
 */
async function httpParser(buff) {
  try {
    const [requestLine, ...lines] = buff.split('\r\n');
    const [method, path, version] = requestLine.split(' ');
    
    // Parse headers
    const headers = {};
    let bodyStart = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line === '') {
        bodyStart = i + 1;
        break;
      }
      
      const [key, ...value] = line.split(':');
      if (key) {
        headers[key.trim().toLowerCase()] = value.join(':').trim();
      }
    }
    
    // Parse body if present
    const body = bodyStart >= 0 ? lines.slice(bodyStart).join('\r\n') : '';
    const parsedBody = parseBody(body);
    
    const data = {
      method: method,
      path: path,
      version: version,
      headers: headers,
      body: parsedBody
    };
    
    // Validate request data
    validateRequest(data);
    
    return data;
  } catch (error) {
    if (error instanceof HTTPParseError) {
      throw error;
    }
    throw new HTTPParseError('Failed to parse HTTP request', 400);
  }
}

const request = require('../test/test.js')
const net = require('net')

// net.createServer((socket)=>{
//	socket.on('data',(data)=>{
//		console.log(data)
//		const  buff = data.toString()
//		console.log(buff)
//		httpParser(buff).then((data) => {
//			console.log(data)
//		}).catch((error) => {
//			console.error(error)
//		})
//	})
// }).listen(8080,()=>{
//	console.log("server started")
//
// })

function findFirstBrac (req, target) {
  for (let i = 0; i < req.length; i++) {
        	if (req[i] === target) {
        		return i // Return the position of the target character
    }
  }
  return -1
}

function storePair (req, httpJSON) {
  let key = ''
  let i = 0
  while (req[i] != ':') {
    key += req[i]
    req.shift()
    //		console.log(req)
  }
  req.shift()
  let value = ''
  i = 0
  //	console.log(req)
  while (req[i] != ',') {
    if (req[i] == null) {
      break
    }
    value += req[i]
    req.shift()
    //		console.log(req)
  }
  req.shift()
  httpJSON[key] = value
  //	console.log(req)
  // console.log("length"+req.length)
  return req
}

function JSONbodyParser (body) {
  const req = body.split('')
  const httpJSON = new Object()
  let pos = 0
  while (req.length != 0) {
    if (req[0] == '{') {
      pos += 1
      req.shift()
    } else if (req[0] == '}') {
      pos += 1
      req.shift()
    } else {
      //                        console.log(req)
      storePair(req, httpJSON)
      //                        console.log("i")
    }
  }

  // console.log(JSON.stringify(httpJSON))
  // console.timeEnd('Execution Time');
  return httpJSON
}

function HTTPbody (req, pos) {
  let body = '';
  
  return new Promise((resolve) => {
    const position = pos;
    for (let i = position; i < req.length; i++) {
      body += req[i];
    }
    resolve(body.trim());
  });
}

function queryParser (request) {
  const pos = findFirstBrac(request, '?');
  const query = request.slice(pos + 1);
  return storeQuery(query);
}

function storeQuery (query) {
  let req = query.split('');
  const httpQueryJSON = {};
  let flag = 0;
  let pos = 0;
  
  while (req.length != 0) {
    if (req[0] == '{') {
      flag += 1;
      pos += 1;
      req.shift();
    } else if (req[0] == '}') {
      flag -= 1;
      pos += 1;
      req.shift();
    } else {
      const { key, value, updatedReq } = queryStorePair(req);
      httpQueryJSON[key] = value;
      req = updatedReq;
    }
  }
  return httpQueryJSON;
}

function queryStorePair(req) {
  let key = '';
  let value = '';
  let i = 0;
  while (req[i] != '=') {
    key += req[i];
    req.shift();
  }
  req.shift();
  i = 0;
  while (req[i] != '&') {
    if (req[i] == null) {
      break;
    }
    value += req[i];
    req.shift();
  }
  req.shift();
  return { key, value, req };
}

queryParser('https//:fhdfjdh.com?key=value&loda=lassan')

httpParser(request).then((data) => {
  console.log(data)
}).catch((error) => {
  console.error(error)
})

module.exports = {
  httpParser,
  HTTPParseError
};
