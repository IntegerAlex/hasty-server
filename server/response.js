const fs = require('fs')
const { lookupMimeType } = require('../lib/utils')
const path = require('path')

/**
 * Response class for handling HTTP responses
 * @class
 * @description Handles HTTP response formatting, headers, and data sending
 */
class Response {
  /**
   * Default status code
   * @type {number}
   */
  statusCode = 200

  /**
   * Enable CORS by default
   * @type {boolean}
   */
  enableCors = false

  /**
   * Map of status codes to status text
   * @type {Object}
   */
  statusTextMap = {
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
  }

  /**
   * Constructor for Response class
   * @param {Object} socket - Socket object
   * @param {boolean} enableCors - Enable CORS
   */
  constructor(socket, enableCors) {
    this.socket = socket
    this.enableCors = enableCors
    this.headers = {}
  }

  /**
   * Set response status code
   * @param {number} code - HTTP status code
   * @returns {Response} Returns this for chaining
   * @throws {Error} If status code is invalid
   */
  status(code) {
    if (!this.statusTextMap[code]) {
      throw new Error(`Invalid status code: ${code}`)
    }
    this.statusCode = code
    return this
  }

  /**
   * Set a single response header
   * @param {string} key - Header name
   * @param {string} value - Header value
   * @returns {Response} Returns this for chaining
   */
  setHeader(key, value) {
    this.headers[key] = value
    return this
  }

  /**
   * Set multiple HTTP headers at once
   * @param {Object} headers - Object containing header key-value pairs
   * @param {string} headers.key - Header name (e.g., 'Content-Type')
   * @param {string} headers.value - Header value (e.g., 'application/json')
   * @returns {Response} Returns this for chaining
   * @example
   * response.setHeaders({
   *   'Content-Type': 'application/json',
   *   'X-Frame-Options': 'DENY'
   * });
   */
  setHeaders(headers) {
    for (const [key, value] of Object.entries(headers)) {
      this.headers[key] = value
    }
    return this
  }

  /**
   * Format all headers into string
   * @private
   * @returns {string} Formatted headers string
   */
  formatHeaders() {
    return Object.keys(this.headers)
      .map(key => `${key}: ${this.headers[key]}`)
      .join('\r\n')
  }

  /**
   * Send response data
   * @param {string|Object} data - Response data to send
   * @returns {void}
   */
  send(data) {
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

    const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers + data)
    this.socket.end()
  }

  /**
   * Send status code response
   * @param {number} code - HTTP status code
   * @returns {void}
   */
  sendStatus(code) {
    this.status(code)
    const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers)
    this.socket.end()
  }

  /**
   * Send JSON response
   * @param {Object} data - Data to send as JSON
   * @returns {void}
   */
  json(data) {
    if (this.enableCors) {
      this.setCorsHeaders()
    }
    const body = JSON.stringify(data)
    this.setHeader('Content-Type', 'application/json')
    this.setHeader('Content-Length', Buffer.byteLength(body))
    const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers + body)
    this.socket.end()
  }

  /**
   * Send file as response
   * @param {string} file - Path to file
   * @returns {void}
   */
  sendFile(file) {
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

      const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
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
   * Send file as downloadable attachment
   * @param {string} file - Path to file
   * @param {string} filename - Suggested filename for download
   * @returns {void}
   */
  download(file, filename) {
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

      const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
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
   * Set CORS headers
   * @private
   * @returns {void}
   */
  setCorsHeaders() {
    if (this.enableCors) {
      this.setHeader('Access-Control-Allow-Origin', '*')
      this.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      this.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
  }
}

module.exports = Response
