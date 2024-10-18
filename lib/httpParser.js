const { findFirstBrac, HTTPbody, JSONbodyParser, queryParser } = require('./utils.js')

// Async function to parse the HTTP request
async function httpParser (request) {
  const req = {} // Create a new object to store the parsed request
  const requestString = request.toString() // Convert buffer to string, if necessary

  // Step 1: Split the request into headers and body by finding "\r\n\r\n"
  const headerBodySplit = requestString.split('\r\n\r\n') // Headers and body are separated by double newline
  const headersPart = headerBodySplit[0] // First part is the headers
  const bodyPart = headerBodySplit[1] // Second part is the body

  // Step 2: Extract the headers (the first line is the request line, e.g., "POST /path HTTP/1.1")
  const headers = headersPart.split('\n')

  // Parse the request line (first line of the headers)
  const requestLine = headers[0].split(' ') // ["POST", "/path", "HTTP/1.1"]
  req.method = requestLine[0] // e.g., "POST"
  req.path = requestLine[1] // e.g., "/path"
  req.version = requestLine[2] // e.g., "HTTP/1.1"

  // Step 3: Handle GET requests (expect a query string)
  req.query = queryParser(req.path) // Parse query string for GET requests
  req.path = req.path.split('?')[0] // Remove query string from path

  // Step 4: Handle POST requests (expect a body)
  if (req.method === 'POST') {
    // Now we need to parse the body, which is in `bodyPart`
    const position = 0 // Start at position 0 of the bodyPart

    // Await the body parsing (this is an async operation)
    const bodyData = await HTTPbody(bodyPart, position)

    // Step 5: Parse the body into JSON format
    try {
      req.body = JSONbodyParser(bodyData) // Convert the parsed body into JSON
    } catch (error) {
      console.error('Error parsing JSON body:', error)
    }

    return req // Return the fully parsed request object
  }

  // Step 6: If it's another HTTP method, just return the parsed headers
  return req
}

module.exports = { httpParser }
