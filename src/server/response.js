const fs = require('fs')
const path = require('path')
const { lookupMimeType } = require('../lib/utils')
const { applyCorsHeaders } = require('../lib/cors')

/**
 * @typedef {Object} ResponseOptions
 * @property {number} [statusCode=200] - HTTP status code
 * @property {Object.<string, string>} [headers={}] - Response headers
 * @property {boolean} [cors=false] - Whether to apply CORS headers
 */

/**
 * @typedef {Object} SendOptions
 * @property {string} [contentType] - Content-Type header value
 * @property {boolean} [end=true] - Whether to end the response after sending
 */

/** @type {Object.<number, string>} */
const STATUS_CODES = Object.freeze({
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
})

/**
 * Response class for handling HTTP responses.
 * @class Response
 * @param {import('net').Socket} socket - The socket object for the response
 * @param {boolean} [enableCors=false] - Whether CORS is enabled
 * @example
 * ```javascript
 * const response = new Response(socket, true);
 * response.status(200).json({ message: 'Success' });
 * ```
 */
class Response {
  /** @type {number} */
  statusCode = 200

  /** @type {boolean} */
  enableCors = false

  /** @type {Object.<string, string>} */
  headers = {}

  /** @type {boolean} */
  headersSent = false

  /** @type {import('net').Socket} */
  socket

  /** @type {boolean} */
  shouldKeepAlive = false

  /**
   * Create a new Response instance
   * @param {import('net').Socket} socket - The socket object for the response
   * @param {boolean} [enableCors=false] - Whether to enable CORS headers
   * @param {boolean} [shouldKeepAlive=false] - Whether to keep the connection alive
   * @param {string} [method='GET'] - The HTTP method of the request
   */
  constructor (socket, enableCors = false, shouldKeepAlive = false, method = 'GET') {
    if (!socket || typeof socket.write !== 'function') {
      throw new Error('Socket is required and must be a writable stream')
    }

    this.socket = socket
    this.enableCors = Boolean(enableCors)
    this.shouldKeepAlive = Boolean(shouldKeepAlive)
    this.method = method.toUpperCase()
    this.headers = {
      'Content-Type': 'text/plain',
      'X-Powered-By': 'Hasty-Server',
      Connection: this.shouldKeepAlive ? 'keep-alive' : 'close'
    }
  }

  // ... (methods omitted for brevity)

  /**
   * Set the HTTP status code for the response
   * @param {number} code - HTTP status code
   * @returns {Response} The Response instance for chaining
   * @throws {Error} If status code is invalid
   */
  status (code) {
    if (!Number.isInteger(code) || code < 100 || code > 599) {
      throw new Error(`Invalid status code: ${code}`)
    }
    this.statusCode = code
    return this
  }

  /**
   * Set a response header
   * @param {string} key - Header name
   * @param {string|number|string[]} value - Header value(s)
   * @returns {Response} The Response instance for chaining
   */
  setHeader (key, value) {
    if (this.headersSent) {
      console.warn('Cannot set header after headers have been sent')
      return this
    }

    if (Array.isArray(value)) {
      this.headers[key] = value.join(', ')
    } else {
      this.headers[key] = String(value)
    }

    return this
  }

  /**
   * Apply CORS headers to the response
   * @private
   * @returns {void}
   */
  _applyCorsHeaders () {
    if (this.enableCors) {
      applyCorsHeaders(this, true)
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
   * Send a response to the client
   * @param {string|Buffer|Object} data - The data to send
   * @param {SendOptions} [options] - Additional options
   * @returns {void}
   */
  send (data, options = {}) {
    if (this.headersSent) {
      console.warn('Headers already sent')
      return
    }

    const { contentType, end = true } = options

    // Set content type if provided or default to text/plain
    if (contentType) {
      this.setHeader('Content-Type', contentType)
    } else if (!this.headers['Content-Type']) {
      this.setHeader('Content-Type', 'text/plain; charset=utf-8')
    }

    // Apply CORS headers
    this._applyCorsHeaders()

    // Handle different data types
    let responseData = data
    if (data !== undefined && data !== null) {
      if (typeof data === 'object' && !Buffer.isBuffer(data)) {
        try {
          responseData = JSON.stringify(data)
          if (!contentType) {
            this.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
        } catch (error) {
          console.error('Error stringifying JSON:', error)
          return this.status(500).send('Error generating response')
        }
      } else if (Buffer.isBuffer(data)) {
        if (!contentType) {
          this.setHeader('Content-Type', 'application/octet-stream')
        }
      } else {
        responseData = String(data)
      }
    } else {
      responseData = ''
    }

    // Set Content-Length header
    const contentLength = responseData ? Buffer.byteLength(responseData) : 0
    this.setHeader('Content-Length', contentLength)

    // Build response
    const statusText = STATUS_CODES[this.statusCode] || 'Unknown Status'
    const headers = Object.entries(this.headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\r\n')

    // Send response
    this.socket.write(
      `HTTP/1.1 ${this.statusCode} ${statusText}\r\n` +
      `${headers}\r\n\r\n`
    )

    // Send response body if present AND not HEAD request
    if (contentLength > 0 && this.method !== 'HEAD') {
      this.socket.write(responseData)
    }

    this.headersSent = true

    // End the connection if requested
    if (end) {
      if (!this.shouldKeepAlive) {
        this.socket.end()
      }
    }
  }

  /**
   * Send a JSON response
   * @param {Object|Array} data - The data to send as JSON
   * @param {number} [status] - Optional status code
   * @returns {void}
   */
  json (data, status) {
    if (status !== undefined) {
      this.status(status)
    }
    this.send(data, { contentType: 'application/json; charset=utf-8' })
  }

  /**
   * Send a file as a download
   * @param {string} filePath - Path to the file
   * @param {string} [filename] - Optional custom filename
   * @param {Object} [options] - Additional options
   * @param {string} [options.contentType] - Custom content type
   * @param {boolean} [options.end=true] - Whether to end the response
   * @returns {void}
   */
  download (filePath, filename, options = {}) {
    if (this.headersSent) {
      console.warn('Headers already sent')
      return
    }

    const { contentType, end = true } = options

    try {
      const stats = fs.statSync(filePath)

      // Set content disposition for download
      const contentDisposition = `attachment${filename ? `; filename="${filename}"` : ''}`
      this.setHeader('Content-Disposition', contentDisposition)

      // Set content type
      if (contentType) {
        this.setHeader('Content-Type', contentType)
      } else {
        const mimeType = lookupMimeType(path.extname(filePath).substring(1)) || 'application/octet-stream'
        this.setHeader('Content-Type', mimeType)
      }

      // Set content length
      this.setHeader('Content-Length', stats.size)

      // Apply CORS headers
      this._applyCorsHeaders()

      // Send headers
      const statusText = STATUS_CODES[this.statusCode] || 'OK'
      const headers = Object.entries(this.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n')

      this.socket.write(
        `HTTP/1.1 ${this.statusCode} ${statusText}\r\n` +
        `${headers}\r\n\r\n`
      )

      this.headersSent = true

      // Stream the file
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(this.socket, { end })

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error)
        if (!this.headersSent) {
          this.status(500).send('Error streaming file')
        } else {
          this.socket.end()
        }
      })

      if (end) {
        fileStream.on('end', () => {
          if (!this.shouldKeepAlive) {
            this.socket.end()
          }
        })
      }
    } catch (error) {
      console.error('Error serving file:', error)
      if (!this.headersSent) {
        if (error.code === 'ENOENT') {
          this.status(404).send('File not found')
        } else {
          this.status(500).send('Error serving file')
        }
      } else {
        this.socket.end()
      }
    }
  }

  /**
   * Send a file with auto content-type
   * @param {string} filePath - Path to the file
   * @param {Object} [options] - Additional options
   * @param {string} [options.contentType] - Custom content type
   * @param {boolean} [options.end=true] - Whether to end the response
   * @returns {void}
   */
  sendFile (filePath, options = {}) {
    if (this.headersSent) {
      console.warn('Headers already sent')
      return
    }

    const { contentType, end = true } = options

    try {
      const stats = fs.statSync(filePath)

      // Set content type based on file extension if not provided
      if (contentType) {
        this.setHeader('Content-Type', contentType)
      } else {
        const mimeType = lookupMimeType(path.extname(filePath).substring(1)) || 'application/octet-stream'
        this.setHeader('Content-Type', mimeType)
      }

      // Set content length
      this.setHeader('Content-Length', stats.size)

      // Apply CORS headers
      this._applyCorsHeaders()

      // Send headers
      const statusText = STATUS_CODES[this.statusCode] || 'OK'
      const headers = Object.entries(this.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n')

      this.socket.write(
        `HTTP/1.1 ${this.statusCode} ${statusText}\r\n` +
        `${headers}\r\n\r\n`
      )

      this.headersSent = true

      // Stream the file
      const fileStream = fs.createReadStream(filePath)
      fileStream.pipe(this.socket, { end })

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error)
        if (!this.headersSent) {
          this.status(500).send('Error streaming file')
        } else {
          this.socket.end()
        }
      })

      if (end) {
        fileStream.on('end', () => {
          if (!this.shouldKeepAlive) {
            this.socket.end()
          }
        })
      }
    } catch (error) {
      console.error('Error serving file:', error)
      if (!this.headersSent) {
        if (error.code === 'ENOENT') {
          this.status(404).send('File not found')
        } else {
          this.status(500).send('Error serving file')
        }
      } else {
        this.socket.end()
      }
    }
  }

  /**
   * Send a response with just a status code and optional message
   * @param {number} statusCode - HTTP status code
   * @param {string} [message] - Optional message (defaults to status text)
   * @returns {void}
   */
  sendStatus (statusCode, message) {
    this.status(statusCode)
    const statusText = message || STATUS_CODES[statusCode] || 'Unknown Status'
    this.send(statusText)
  }

  /**
   * End the response
   * @param {string|Buffer} [data] - Optional data to send before ending
   * @returns {void}
   */
  end (data) {
    if (data !== undefined) {
      this.send(data, { end: true })
    } else if (!this.headersSent) {
      // Send headers with no body
      this.setHeader('Content-Length', '0')
      this._applyCorsHeaders()

      const statusText = STATUS_CODES[this.statusCode] || 'OK'
      const headers = Object.entries(this.headers)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\r\n')

      this.socket.write(
        `HTTP/1.1 ${this.statusCode} ${statusText}\r\n` +
        `${headers}\r\n\r\n`
      )

      this.headersSent = true
      if (!this.shouldKeepAlive) {
        this.socket.end()
      }
    } else {
      if (!this.shouldKeepAlive) {
        this.socket.end()
      }
    }
  }
} // End of Response class

Response.STATUS_CODES = STATUS_CODES

module.exports = Response
