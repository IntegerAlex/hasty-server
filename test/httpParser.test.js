const { httpParser } = require('../src/lib/httpParser')

describe('httpParser', () => {
  test('should parse a simple request', (done) => {
    const request = ('GET /path HTTP/1.1\r\nHost: localhost:3000\r\n\r\n').toString()
    const req = httpParser(request)
    req.then((result) => {
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        version: 'HTTP/1.1',
        query: {},
        headers: {
          host: 'localhost:3000'
        },
        ip: '127.0.0.1',
        body: undefined
      })
      done()
    })
  })
  test('should parse a request with a query string', (done) => {
    const request = ('GET /path?query=string HTTP/1.1\r\nHost: localhost:3000\r\n\r\n').toString()
    const req = httpParser(request)
    req.then((result) => {
      expect(result).toEqual({
        method: 'GET',
        path: '/path',
        version: 'HTTP/1.1',
        query: { query: 'string' },
        headers: {
          host: 'localhost:3000'
        },
        ip: '127.0.0.1',
        body: undefined
      })
      done()
    })
  })
  test('should parse a POST request with a JSON body', (done) => {
    const request = ('POST /path HTTP/1.1\r\nHost: localhost:3000\r\nContent-Type: application/json\r\n\r\n{"key": "value"}').toString()
    const req = httpParser(request)
    req.then((result) => {
      expect(result).toEqual({
        method: 'POST',
        path: '/path',
        version: 'HTTP/1.1',
        query: {},
        body: { key: 'value' },
        headers: {
          host: 'localhost:3000',
          'content-type': 'application/json'
        },
        ip: '127.0.0.1'
      })
      done()
    })
  })

  test('should parse a nested JSON body', (done) => {
    const request = ('POST /path HTTP/1.1\r\nHost: localhost:3000\r\nContent-Type: application/json\r\n\r\n{"key": {"nested": "value"}}').toString()
    const req = httpParser(request)
    req.then((result) => {
      expect(result).toEqual({
        method: 'POST',
        path: '/path',
        version: 'HTTP/1.1',
        query: {},
        body: { key: { nested: 'value' } },
        headers: {
          host: 'localhost:3000',
          'content-type': 'application/json'
        },
        ip: '127.0.0.1'
      })
      done()
    })
  })
})
