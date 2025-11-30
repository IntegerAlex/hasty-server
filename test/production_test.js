const net = require('net');
const assert = require('assert');
const Hasty = require('../src/server/index.js');

const PORT = 3456;
const server = new Hasty();
server.cors(true);

server.post('/echo', (req, res) => {
    res.json(req.body);
});

server.get('/ping', (req, res) => {
    res.send('pong');
});

server.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    try {
        await testChunkedRequest();
        await testKeepAlive();
        await testCors();
        console.log('ALL TESTS PASSED');
        process.exit(0);
    } catch (error) {
        console.error('TEST FAILED:', error);
        process.exit(1);
    }
});

function testChunkedRequest() {
    return new Promise((resolve, reject) => {
        console.log('Testing Chunked Request...');
        const client = new net.Socket();
        const body = JSON.stringify({ message: 'Hello World' });
        const request = `POST /echo HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${body.length}\r\n\r\n`;

        client.connect(PORT, '127.0.0.1', () => {
            // Send headers first
            client.write(request);

            // Send body in chunks with delay
            setTimeout(() => {
                client.write(body.slice(0, 5));
                setTimeout(() => {
                    client.write(body.slice(5));
                }, 100);
            }, 100);
        });

        client.on('data', (data) => {
            const response = data.toString();
            if (response.includes('Hello World')) {
                console.log('✅ Chunked Request Passed');
                client.end();
                resolve();
            } else {
                reject(new Error('Chunked response did not contain expected body'));
            }
        });
    });
}

function testKeepAlive() {
    return new Promise((resolve, reject) => {
        console.log('Testing Keep-Alive...');
        const client = new net.Socket();
        let responseCount = 0;

        client.connect(PORT, '127.0.0.1', () => {
            // Send two requests back-to-back
            const req1 = `GET /ping HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n\r\n`;
            const req2 = `GET /ping HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n`;

            client.write(req1);
            setTimeout(() => {
                client.write(req2);
            }, 100);
        });

        client.on('data', (data) => {
            const responses = data.toString().split('HTTP/1.1 200 OK');
            // Note: split will create empty string at start, so length should be > 2 for 2 responses
            // Or we can just count "pong"
            const pongs = (data.toString().match(/pong/g) || []).length;
            responseCount += pongs;

            if (responseCount >= 2) {
                console.log('✅ Keep-Alive Passed');
                client.end();
                resolve();
            }
        });

        client.on('end', () => {
            if (responseCount < 2) {
                reject(new Error(`Keep-Alive failed: received ${responseCount} responses, expected 2`));
            }
        });
    });
}

function testCors() {
    return new Promise((resolve, reject) => {
        console.log('Testing CORS...');
        const client = new net.Socket();
        const request = `OPTIONS /echo HTTP/1.1\r\nHost: localhost\r\nOrigin: http://example.com\r\nAccess-Control-Request-Method: POST\r\n\r\n`;

        client.connect(PORT, '127.0.0.1', () => {
            client.write(request);
        });

        client.on('data', (data) => {
            const response = data.toString();
            if (response.includes('Access-Control-Allow-Origin: *') &&
                response.includes('Access-Control-Allow-Methods')) {
                console.log('✅ CORS Passed');
                client.end();
                resolve();
            } else {
                reject(new Error('CORS response missing headers'));
            }
        });
    });
}
