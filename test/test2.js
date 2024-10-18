const Server = require('../server/index.js')
const server = new Server()

// this test is for "Add sending of status code with response AND handling of different method requests on same route" ISSUE N. #12

// Test response in json format
server.get('/', (req, res) => {
  
  res.json({ status: 200 })
})

// Test for handling different method requests on same route
server.get('/hello', (req, res) => {
  res.send('Hello from GET request')
})

server.post('/hello', (req, res) => {
  res.send('Hello again from POST request')
})

// Test for chaining status codes with response, without chaining status code will default to 200
server.get('/chain', (req, res) => {
  res.status(201).send('This req has status code of 201')
})

server.get('/chain-status', (req, res) => {
  res.status(202).json({ message: 'This req has status code of 202' })
})

server.listen(8080, () => {
  
})
