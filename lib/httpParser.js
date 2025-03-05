const { findFirstBrac, HTTPbody, JSONbodyParser, queryParser } = require('./utils.js')

// Async function to parse the HTTP request
async function httpParser(request, connection = {}) {
  try {
    const req = {} // Create a new object to store the parsed request
    const requestString = request.toString() // Convert buffer to string, if necessary

    // Set client IP address (similar to Express)
    req.ip = connection.remoteAddress || '127.0.0.1'
    
    // Step 1: Split the request into headers and body by finding "\r\n\r\n"
    const headerBodySplit = requestString.split('\r\n\r\n') // Headers and body are separated by double newline
    if (headerBodySplit.length < 1) {
      throw new Error('Invalid HTTP request format')
    }
    
    const headersPart = headerBodySplit[0] // First part is the headers
    const bodyPart = headerBodySplit[1] || '' // Second part is the body, default to empty string if no body

    // Step 2: Extract the headers (the first line is the request line, e.g., "POST /path HTTP/1.1")
    const headers = headersPart.split(/\r?\n/).filter(line => line.trim()) // Handle both \r\n and \n

    // Parse the request line (first line of the headers)
    const requestLine = headers[0].split(' ') // ["POST", "/path", "HTTP/1.1"]
    if (requestLine.length !== 3) {
      throw new Error('Invalid request line format')
    }

    req.method = requestLine[0].toUpperCase() // e.g., "POST"
    req.path = requestLine[1] // e.g., "/path"
    req.version = requestLine[2] // e.g., "HTTP/1.1"

    // Add headers parsing
    req.headers = {}
    for (let i = 1; i < headers.length; i++) {
      const line = headers[i].trim()
      if (line) {
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) continue // Skip malformed headers
        
        const key = line.slice(0, colonIndex).trim().toLowerCase()
        const value = line.slice(colonIndex + 1).trim()
        req.headers[key] = value
      }
    }

    // Step 3: Handle GET requests (expect a query string)
    req.query = queryParser(req.path) // Parse query string for GET requests
    req.path = req.path.split('?')[0] // Remove query string from path

    // Step 4: Handle POST and OPTIONS requests
    if (req.method === 'POST') {
      if (!bodyPart) {
        req.body = {}
      } else {
        try {
          // Await the body parsing (this is an async operation)
          const bodyData = await HTTPbody(bodyPart, 0)
          // Step 5: Parse the body into JSON format
          req.body = JSONbodyParser(bodyData) // Convert the parsed body into JSON
        } catch (error) {
          console.error('Error parsing request body:', error)
          req.body = {} // Set empty object as fallback
        }
      }
    } else if (req.method === 'OPTIONS') {
      // Handle OPTIONS preflight request
      req.body = {}
      // Store CORS-specific headers for easy access
      req.cors = {
        origin: req.headers['origin'],
        method: req.headers['access-control-request-method'],
        headers: req.headers['access-control-request-headers']
      }
    }

    return req // Return the fully parsed request object
  } catch (error) {
    console.error('Error parsing HTTP request:', error)
    throw error // Re-throw to let caller handle the error
  }
}

module.exports = { httpParser }
