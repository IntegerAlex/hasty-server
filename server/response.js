const fs = require('fs')
const { lookupMimeType } = require('../lib/utils')
const path = require('path')


const STATUS_CODES = Object.freeze({
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  204: 'No Content',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  409: 'Conflict',
  417: 'Expectation Failed',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  503: 'Service Unavailable'
})


/**
 * Response class for handling HTTP responses.
 * 
 * @class Response
 * 
 * @param {Socket} socket - The socket object for the response.
 * @param {boolean} enableCors - Enable Cross-Origin Resource Sharing (CORS).
 * @param {string} statusTextMap - Map of status codes to status texts.
 * @example 
 * ```javascript
const Response = require('./response.js');

// Basic usage
response.status(200).send('Hello World');

// JSON response
response.json({ message: 'Success' });

// File download
response.download('/path/to/file.txt', 'download.txt');

// Send file with auto content-type
response.sendFile('/path/to/image.png');
```
 */

class Response {
  statusCode = 200
  enableCors = false // default to false

  /**
   * Create a new Response instance.
   * @param {Socket} socket - The socket object for the response.
   * @param {boolean} enableCors - Enable Cross-Origin Resource Sharing (CORS).
   */
  constructor (socket, enableCors) {
    this.socket = socket
    this.enableCors = enableCors // Set the cors state
    this.headers = {}
  }

  /**
   * 
   * @param {number} code - The HTTP status code.
   * @returns - The Response instance.
   */
  status (code) {
    if (!STATUS_CODES[code]) {
      throw new Error(`Invalid status code: ${code}`)
    }
    this.statusCode = code
    return this
  }

  /**
   * 
   * @param {string} key - The header key.
   * @param {string} value - The header value.
   * @returns - The Response instance.
   */
  setHeader (key, value) {
    this.headers[key] = value
    return this
  }

  // Set CORS headers
  /**
   * It sets the CORS headers if CORS is enabled.
   */
	  setCorsHeaders () {
    if (this.enableCors) {
      this.setHeader('Access-Control-Allow-Origin', '*')
      this.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      this.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
  }

  /**
   * It formats the headers into a string.
   */
  formatHeaders () {
    return Object.keys(this.headers)
      .map(key => `${key}: ${this.headers[key]}`)
      .join('\r\n')
  }

  /**
   * 
   * @param {string} data - The data to send.
   * @returns - If the data is an object or array, send as JSON
   */
  send (data) {
   	if (this.enableCors) {
      this.setCorsHeaders()
    }
    // Set Content-Type based on the type of data being sent
    if (typeof data === 'string') {
      // If the data is a string, check if it's HTML
      if (data.startsWith('<') && data.endsWith('>')) {
        this.setHeader('Content-Type', 'text/html') // Set Content-Type to HTML
      } else {
        this.setHeader('Content-Type', 'text/plain') // Default to plain text
      }
    } else {
      // If the data is an object or array, send as JSON
      return this.json(data)
    }

    this.setHeader('Content-Length', Buffer.byteLength(data))

    const headers = `HTTP/1.1 ${this.statusCode} ${STATUS_CODES[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers + data)
    this.socket.end()
  }

  /**
   * 
   * @param {number} statusCode - The HTTP status code.
   * Updates the status code and sends the status code as a response.
   */
  sendStatus (statusCode) {
    this.status(statusCode)
    const headers = `HTTP/1.1 ${this.statusCode} ${STATUS_CODES[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers)
    this.socket.end()
  }

  /**
   * 
   * @param {*} data - The data to send.
   */
  json (data) {
	    if (this.enableCors) {
      this.setCorsHeaders()
	    }
    const body = JSON.stringify(data)
    this.setHeader('Content-Type', 'application/json')
    this.setHeader('Content-Length', Buffer.byteLength(body))
    const headers = `HTTP/1.1 ${this.statusCode} ${STATUS_CODES[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers + body)
    this.socket.end()
  }

  /**
   * 
   * @param {*} file - The file to send.
   */
  sendFile (file) {
	    if (this.enableCors) {
      this.setCorsHeaders()
	    }
    const mimeType = lookupMimeType(path.extname(file).slice(1))
    this.setHeader('Content-Type', mimeType)

    fs.stat(file, (err, stats) => {
      if (err) {
        this.sendStatus(404)
        return
      }

      this.setHeader('Content-Length', stats.size)

      const headers = `HTTP/1.1 ${this.statusCode} ${STATUS_CODES[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
      this.socket.write(headers)

      const stream = fs.createReadStream(file)
      stream.pipe(this.socket)

      stream.on('error', () => {
        this.sendStatus(500)
      })

      stream.on('end', () => {
        this.socket.end()
      })
    })
  }

  /**
   * 
   * @param {*} file - The file to send.
   * @param {*} filename - The filename to send.
   */
  download (file, filename) {
    if (this.enableCors) {
      this.setCorsHeaders()
    }
    const mimeType = lookupMimeType(path.extname(file).slice(1))
    this.setHeader('Content-Type', mimeType)
    this.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    fs.stat(file, (err, stats) => {
      if (err) {
        this.sendStatus(404)
        return
      }

      this.setHeader('Content-Length', stats.size)

      const headers = `HTTP/1.1 ${this.statusCode} ${STATUS_CODES[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
      this.socket.write(headers)

      const stream = fs.createReadStream(file)
      stream.pipe(this.socket)

      stream.on('error', () => {
        this.sendStatus(500)
      })

      stream.on('end', () => {
        this.socket.end()
      })
    })
  }
}

Response.STATUS_CODES = STATUS_CODES

module.exports = Response
