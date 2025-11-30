const net = require('net')
const Hasty = require('../src/server/index.js')

const PORT = 3458
const server = new Hasty()
server.cors(true)

// Method Tests
server.get('/methods/get', (req, res) => res.send('GET OK'))
server.post('/methods/post', (req, res) => res.status(201).json(req.body))
server.put('/methods/put', (req, res) => res.json(req.body))
server.delete('/methods/delete', (req, res) => res.status(204).end())
server.patch('/methods/patch', (req, res) => res.json(req.body))
server.head('/methods/head', (req, res) => res.send('HEAD OK')) // Should not send body
server.options('/methods/options', (req, res) => res.status(204).end())

// Body Type Tests
server.post('/types/json', (req, res) => res.json(req.body))
server.post('/types/form', (req, res) => res.json(req.body))
server.post('/types/text', (req, res) => res.send(req.body))

// Header Tests
server.get('/headers', (req, res) => {
  res.json({
    contentType: req.headers['content-type'],
    custom: req.headers['x-custom-header']
  })
})

server.listen(PORT, async () => {
  console.log(`Compliance server running on port ${PORT}`)

  const tests = [
    testMethods,
    testBodyTypes,
    testHeaders
  ]

  let failed = 0

  for (const test of tests) {
    try {
      await test()
      console.log(`✅ ${test.name} Passed`)
    } catch (error) {
      console.error(`❌ ${test.name} Failed:`, error.message)
      failed++
    }
  }

  if (failed > 0) {
    console.log(`${failed} tests failed`)
    process.exit(1)
  } else {
    console.log('ALL COMPLIANCE TESTS PASSED')
    process.exit(0)
  }
})

function connect () {
  return new Promise((resolve) => {
    const client = new net.Socket()
    client.connect(PORT, '127.0.0.1', () => resolve(client))
  })
}

function sendRequest (client, request) {
  return new Promise((resolve, reject) => {
    client.write(request)
    client.on('data', (data) => {
      resolve(data.toString())
      client.end()
    })
    client.on('error', reject)
  })
}

async function testMethods () {
  // GET
  let client = await connect()
  let res = await sendRequest(client, 'GET /methods/get HTTP/1.1\r\nHost: localhost\r\n\r\n')
  if (!res.includes('200 OK') || !res.includes('GET OK')) throw new Error('GET failed')

  // POST
  client = await connect()
  res = await sendRequest(client, 'POST /methods/post HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: 13\r\n\r\n{"foo":"bar"}')
  if (!res.includes('201 Created') || !res.includes('{"foo":"bar"}')) throw new Error('POST failed')

  // PUT
  client = await connect()
  res = await sendRequest(client, 'PUT /methods/put HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: 13\r\n\r\n{"foo":"bar"}')
  if (!res.includes('200 OK') || !res.includes('{"foo":"bar"}')) throw new Error('PUT failed')

  // DELETE
  client = await connect()
  res = await sendRequest(client, 'DELETE /methods/delete HTTP/1.1\r\nHost: localhost\r\n\r\n')
  if (!res.includes('204 No Content')) throw new Error('DELETE failed')

  // PATCH
  client = await connect()
  res = await sendRequest(client, 'PATCH /methods/patch HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: 13\r\n\r\n{"foo":"bar"}')
  if (!res.includes('200 OK') || !res.includes('{"foo":"bar"}')) throw new Error('PATCH failed')

  // HEAD
  client = await connect()
  res = await sendRequest(client, 'HEAD /methods/head HTTP/1.1\r\nHost: localhost\r\n\r\n')
  if (!res.includes('200 OK') || res.includes('HEAD OK')) throw new Error('HEAD failed (should not have body)')

  // OPTIONS
  client = await connect()
  res = await sendRequest(client, 'OPTIONS /methods/options HTTP/1.1\r\nHost: localhost\r\n\r\n')
  // Note: Hasty server might auto-handle OPTIONS for CORS, but we defined a custom route too.
  // Let's check if it returns 204 as defined.
  if (!res.includes('204 No Content')) throw new Error('OPTIONS failed')
}

async function testBodyTypes () {
  // JSON
  let client = await connect()
  const jsonBody = '{"a":[1,2],"b":3}'
  let res = await sendRequest(client, `POST /types/json HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${jsonBody.length}\r\n\r\n${jsonBody}`)
  if (!res.includes(jsonBody)) {
    console.log('JSON Body Response:', res)
    throw new Error('JSON body failed')
  }

  // Form URL Encoded
  client = await connect()
  res = await sendRequest(client, 'POST /types/form HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 11\r\n\r\nkey=val&a=b')
  // Expected JSON output from queryParser: {"key":"val","a":"b"}
  if (!res.includes('"key":"val"') || !res.includes('"a":"b"')) throw new Error('Form body failed')

  // Text
  client = await connect()
  res = await sendRequest(client, 'POST /types/text HTTP/1.1\r\nHost: localhost\r\nContent-Type: text/plain\r\nContent-Length: 11\r\n\r\nHello World')
  if (!res.includes('Hello World')) throw new Error('Text body failed')
}

async function testHeaders () {
  const client = await connect()
  // Mixed case headers
  const res = await sendRequest(client, 'GET /headers HTTP/1.1\r\nHost: localhost\r\nCoNtEnT-TyPe: text/plain\r\nX-CuStOm-HeAdEr: my-value\r\n\r\n')

  // Headers should be parsed to lowercase keys in req.headers
  if (!res.includes('"contentType":"text/plain"') && !res.includes('"content-type":"text/plain"')) {
    // Check how the server echoes it back. The route uses req.headers['content-type']
    // If the parser lowercases keys, it should work.
    throw new Error('Header case-insensitivity failed')
  }
  if (!res.includes('"custom":"my-value"')) throw new Error('Custom header failed')
}
