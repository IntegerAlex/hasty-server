const fs = require('fs')
const { lookupMimeType } = require('../lib/utils')
const path = require('path')

class Response {
  statusCode = 200
  enableCors = false // default to false
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

  constructor (socket, enableCors) {
    this.socket = socket
    this.enableCors = enableCors // Set the cors state
    this.headers = {}
  }

  status (code) {
    if (!this.statusTextMap[code]) {
      throw new Error(`Invalid status code: ${code}`)
    }
    this.statusCode = code
    return this
  }

  setHeader (key, value) {
    this.headers[key] = value
    return this
  }

  // Set CORS headers
  setCorsHeaders () {
    if (this.enableCors) {
      this.setHeader('Access-Control-Allow-Origin', '*')
      this.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      this.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
    return null
  }

  formatHeaders () {
    return Object.keys(this.headers)
      .map(key => `${key}: ${this.headers[key]}`)
      .join('\r\n')
  }

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

    const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers + data)
    this.socket.end()
  }

  sendStatus (statusCode) {
    this.status(statusCode)
    const headers = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\r\n${this.formatHeaders()}\r\n\r\n`
    this.socket.write(headers)
    this.socket.end()
  }

  json (data) {
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

  sendFile (file) {
    if (this.enableCors) {
      this.setCorsHeaders()
    }
    const mimeType = lookupMimeType(path.extname(file).slice(1))
    this.setHeader('Content-Type', mimeType)

    fs.stat(file, (err, stats) => {
      if (err) {
        this.sendStatus(404)
        return null
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
    return null
  }

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
        return null
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
    return null
  }
}

module.exports = Response
