const net = require('net');
const Hasty = require('../server/index'); // Adjust the path as needed

describe('Hasty Server', () => {

    let server;

    afterEach((done) => {
        if (server) {
            server.close(() => {
                done();
            });
        } else {
            done();
        }
    });

    test('should call the correct callback for a GET request', done => {
        server = new Hasty();

        // Mock response object
        const callback = (req, res) => {
            res.send('GET request received');
        };

        server.get('/test', callback);

        server.listen(3000, () => {
            console.log('Server is listening on port 3000');

            const client = net.connect({ port: 3000 }, () => {
                client.write('GET /test HTTP/1.1\r\nHost: localhost\r\n\r\n');
            });

            client.on('data', (data) => {
                console.log('Received data from server:', data.toString());

                // Assert that the response is what we expect
                expect(data.toString()).toContain('GET request received');
                client.end();
                done();
            });

            client.on('error', (err) => {
                console.error('Client error:', err);
                done(err);
            });
        });
    }, 10000); // Increase the timeout to 10 seconds

    test('/GET json', done => {
        server = new Hasty();
        const callback = (req, res) => {
            res.json({ message: 'GET request received' });
        };
        server.get('/json', callback);
        server.listen(3000, () => {
            console.log('Server is listening on port 3000');
            const client = net.connect({ port: 3000 }, () => {
                client.write('GET /json HTTP/1.1\r\nHost: localhost\r\n\r\n');
            });
		 client.on('data', (data) => {
            console.log('Received data from server:', data.toString());
            try {
                // Check if the response is valid JSON
                const jsonResponse =	data.toString().split('\r\n\r\n')[1];
                console.log('jsonResponse:', jsonResponse);
		JSON.parse(jsonResponse);
                expect(true).toBe(true); // If JSON.parse doesn't throw an error, the test passes
            } catch (e) {
                // If parsing fails, the test should fail
                expect('Invalid JSON').toBe('Valid JSON');
            }
            client.end();
            done();
        });
            client.on('error', (err) => {
                console.error('Client error:', err);
                done(err);
            });
        });
    }, 10000); // Increase the timeout to 10 seconds

});

