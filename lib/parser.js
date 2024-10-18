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

function queryParser (request) {
  const req = new Object()
  const pos = findFirstBrac(request, '?')
  const query = request.slice(0, pos)
  while (req.length != 0) {
    storeQuery(query)
  }
}

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
