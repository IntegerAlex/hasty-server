const net = require('net')
const Hasty = require('../server/index') // Adjust the path as neededc
const fs = require('fs')
describe('Hasty Server', () => {
  let server

  test('should call the correct callback for a GET request', done => {
    server = new Hasty()

    // Mock response object
    const callback = (req, res) => {
      res.send('GET request received')
    }

    server.get('/test', callback)

    server.listen(3000, () => {
      console.log('Server is listening on port 3000')

      const client = net.connect({ port: 3000 }, () => {
        client.write('GET /test HTTP/1.1\r\nHost: localhost\r\n\r\n')
      })

      client.on('data', (data) => {
        console.log('Received data from server:', data.toString())

        // Assert that the response is what we expect
        expect(data.toString()).toContain('GET request received')
        client.end()
        server.close()
        done()
      })

      client.on('error', (err) => {
        console.error('Client error:', err)
        done(err)
      })
    })
  }, 5000) // Increase the timeout to 10 seconds

  test('/GET json', done => {
    server = new Hasty()
    const callback = (req, res) => {
      res.json({ message: 'GET request received' })
    }
    server.get('/json', callback)
    server.listen(3000, () => {
      fetch('http://localhost:3000/json')
        .then(response => {
          return response.json()
        }).then(data => {
          expect(data).toEqual({ message: 'GET request received' })
          server.close()
          done()
        }).catch(err => {
          console.log(err)
        })
    })
  }, 5000) // Increase the timeout to 10 seconds

  test('/GET sendFile', done => {
    const server = new Hasty()
    const callback = (req, res) => {
      const path = require('path')
      res.sendFile(path.join(__dirname, 'index.html'))
    }

    server.get('/file', callback)
    server.listen(3000, () => {
      const path = require('path')
      fetch('http://localhost:3000/file')
        .then(response => {
          // Check if the Content-Type header is as expected
          expect(response.headers.get('Content-Type')).toBe('text/html')
          return response.text() // Read the response body
        })
        .then(data => {
          const stream = fs.createReadStream(path.join(__dirname, 'index.html'))
          stream.on('data', chunk => {
            expect(data).toEqual(chunk.toString()) // Check the response body
            server.close()
            done()
          })
          stream.on('error', err => {
            console.error(err)
            done(err)
          })
        })
        .catch(err => {
          console.log(err)
          done(err) // Pass the error to the done callback
        })
    })
  }, 10000)
})
