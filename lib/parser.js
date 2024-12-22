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

function findFirstBrac (req, target) {
  for (let i = 0; i < req.length; i++) {
        	if (req[i] === target) {
        		return i // Return the position of the target character
    }
  }
  return -1
}

// POST /api/users HTTP/1.1
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
