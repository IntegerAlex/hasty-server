const request = require('../test/test.js')
const net = require('net')

// net.createServer((socket)=>{
//	socket.on('data',(data)=>{
//		console.log(data)
//		const  buff = data.toString()
//		console.log(buff)
//		httpParser(buff)
//	})
// }).listen(8080,()=>{
//	console.log("server started")
//
// })

/**
 * Finds the first occurrence of a target character in a given string.
 *
 * @param {string} req - The string to search within.
 * @param {string} target - The character to find in the string.
 * @returns {number} The index of the first occurrence of the target character,  
 *                   or -1 if the target character is not found.
 * 
 * @example 
 * 
 * const myString = "Hello, world!";
 * const targetChar = "o";
 * const index = findFirstBrac(myString, targetChar);
 * 
 * if (index !== -1) {
 *   console.log(`The first occurrence of '${targetChar}' is at index ${index}.`);
 * } else {
 *   console.log(`The character '${targetChar}' is not found in the string.`);
 * }
 */
function findFirstBrac (req, target) {
  for (let i = 0; i < req.length; i++) {
        	if (req[i] === target) {
        		return i // Return the position of the target character
    }
  }
  return -1
}

// POST /api/users HTTP/1.1
/**
 * Parses an HTTP request string and extracts its components.
 *
 * @param {string} request - The HTTP request string to parse.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP method, path, version, and body (if applicable).
 * 
 * @example
 * // Example HTTP request string
const httpRequest = `POST /api/data HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 51

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}`;

// Call the httpParser function with the example request
httpParser(httpRequest).then(parsedRequest => {
  console.log(parsedRequest);
}).catch(error => {
  console.error('Error parsing HTTP request:', error);
});
*  
 */
async function httpParser (request) {
  const req = new Object()
  const requestString = request.split('\n')
  const pos = findFirstBrac(requestString, '{')
  const requestWoBody = requestString.slice(0, pos)
  // console.log(requestWoBody)
  req.method = requestWoBody[0].split(' ')[0]
  req.path = requestString[0].split(' ')[1]
  req.version = requestString[0].split(' ')[2]
  if (req.method == 'GET') {
    return req
  }
  HTTPbody(requestString, pos)
    .then((data) => {
      req.body = JSONbodyParser(data)
    })

  // console.log(requestString)
  // console.log(req)
  return req
}
// httpParser("POST /api/users HTTP/1.1 \nhost:www.google.com")
// console.time('Execution Time');
// JSONbodyParser("{key:value,loda:lassan,}")
// console.time()
httpParser(request).then((data) => {

})

/** 
 * Stores a key-value pair from a request string into a JSON object.
 *
 * @param {Array} req - The request string split into an array of characters.
 * @param {Object} httpJSON - The JSON object to store the key-value pair.
 * @returns {Array} The modified request array after extracting the key-value pair.
 * 
 * @example
 * // Example request string
const requestString = "key1:value1,key2:value2";
const reqArray = requestString.split('');
const httpJSON = {};

// Extract key-value pairs
while (reqArray.length > 0) {
  storePair(reqArray, httpJSON);
}

console.log(httpJSON); // Output: { key1: 'value1', key2: 'value2' }

 */
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

/**
 * Parses a JSON body string and converts it into a JSON object.
 *
 * @param {string} body - The JSON body string to parse.
 * @returns {Object} The parsed JSON object.
 * 
 * @example
 * const jsonString = "{\"key1\":\"value1\",\"key2\":\"value2\"}";
const parsedObject = JSONbodyParser(jsonString);
console.log(parsedObject); // Output: { key1: 'value1', key2: 'value2' }

 */
function JSONbodyParser (body) {
	 const req = body.split('')
  const httpJSON = new Object()
  let flag = 0
  let pos = 0
  while (req.length != 0) {
    if (req[0] == '{') {
      flag += 1
      pos += 1
      req.shift()
    } else if (req[0] == '}') {
      flag -= 1
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

/**
 * Extracts the body of an HTTP request starting from a given position.
 *
 * @param {Array} req - The request string split into an array of lines.
 * @param {number} pos - The position to start extracting the body.
 * @returns {Promise<string>} A promise that resolves to the extracted body string.
 * 
 * @example
 * const httpRequest = `POST /api/data HTTP/1.1
Host: example.com
Content-Type: application/json

{
  "name": "John Doe",
  "age": 30
}`;

const requestLines = httpRequest.split('\n');
const bodyStartPos = findFirstBrac(requestLines, '{');

HTTPbody(requestLines, bodyStartPos).then((body) => {
  console.log('Extracted Body:', body);
});
 */
function HTTPbody (req, pos) {
  flag = 0
  let body = ''
  return new Promise((resolve, reject) => {
    const position = pos
    for (let i = position; i < req.length; i++) {
      if (req[i] == '{') {
        flag++
        body += req[i]
      } else if (req[i] == '}') {
        flag--
        body += req[i]
      }
        		body += req[i]
    }
    // console.log((body.replace(/\s+/g, '').replace(/"/g, '')))  remove all white spaces and quotes

    resolve(body.replace(/\s+/g, '').replace(/"/g, ''))
  })
}

/**
 * Parses a query string from a URL and extracts its components.
 *
 * @param {string} request - The URL containing the query string.
 * 
 * @example
const url = 'https://example.com?name=JohnDoe&age=25&city=NewYork';
const parsedQuery = queryParser(url);
console.log(parsedQuery); // Output: { name: 'JohnDoe', age: '25', city: 'NewYork' }
 */
function queryParser (request) {
  const req = new Object()
  const pos = findFirstBrac(request, '?')
  const query = request.slice(0, pos)
  while (req.length != 0) {
    storeQuery(query)
  }
}

/**
 * Stores a query string into a JSON object.
 *
 * @param {string} query - The query string to parse.
 * @returns {Object} The parsed query string as a JSON object.
 * 
 * @example
 * // Example usage
const queryString = "key1=value1&key2=value2";
const parsedQuery = storeQuery(queryString);
console.log(parsedQuery); // Output: { key1: 'value1', key2: 'value2' }
 */
function storeQuery (query) {
  const req = query.split('')
  const httpQueryJSON = new Object()
  let flag = 0
  let pos = 0
  while (req.length != 0) {
    if (req[0] == '{') {
      flag += 1
      pos += 1
      req.shift()
    } else if (req[0] == '}') {
      flag -= 1
      pos += 1
      req.shift()
    } else {
      queryStorePair(req)
    }
  }
  return httpQueryJSON
}

/**
 * Stores a key-value pair from a query string into a JSON object.
 *
 * @param {Array} req - The query string split into an array of characters.
 * @returns {Object} The JSON object containing the key-value pair.
 * 
 * @example 
 * const queryString = "key1=value1&key2=value2";
const queryArray = queryString.split('');
let queryJSON = {};

while (queryArray.length > 0) {
  const pair = queryStorePair(queryArray);
  queryJSON = { ...queryJSON, ...pair };
}

console.log(queryJSON); // Output: { key1: 'value1', key2: 'value2' }
 */
function queryStorePair (req) {
  let key = ''
  let i = 0
  while (req[i] != '=') {
    key += req[i]
    req.shift()
  }
  req.shift()
  let value = ''
  i = 0
  while (req[i] != '&') {
    value += req[i]
    req.shift()
  }
  req.shift()
  httpQueryJSON[key] = value

  // console.log(req)
  return httpQueryJSON
}

// storeQuery("key=value&loda=lassan")
queryParser('https//:fhdfjdh.com?key=value&loda=lassan')
