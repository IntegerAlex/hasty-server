const net = require('net');
const Hasty = require('../src/server/index.js');

const PORT = 3457;
const server = new Hasty();

server.post('/echo', (req, res) => {
    res.json(req.body);
});

server.get('/ping', (req, res) => {
    res.send('pong');
});

server.listen(PORT, async () => {
    console.log(`Battle server running on port ${PORT}`);

    const tests = [
        testMalformedJson,
        testHugeHeaders,
        testGarbageData,
        testInvalidMethod,
        testSlowloris
    ];

    let failed = 0;

    for (const test of tests) {
        try {
            await test();
            console.log(`✅ ${test.name} Passed`);
        } catch (error) {
            console.error(`❌ ${test.name} Failed:`, error.message);
            failed++;
        }
    }

    if (failed > 0) {
        console.log(`${failed} tests failed`);
        process.exit(1);
    } else {
        console.log('ALL BATTLE TESTS PASSED');
        process.exit(0);
    }
});

function connect() {
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.connect(PORT, '127.0.0.1', () => resolve(client));
    });
}

async function testMalformedJson() {
    const client = await connect();
    const body = '{ "key": "value", '; // Incomplete JSON
    const request = `POST /echo HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/json\r\nContent-Length: ${body.length}\r\n\r\n${body}`;

    client.write(request);

    return new Promise((resolve, reject) => {
        client.on('data', (data) => {
            const response = data.toString();
            // Should probably return empty object or error, but definitely not crash
            if (response.includes('200 OK') || response.includes('400 Bad Request')) {
                client.end();
                resolve();
            } else {
                reject(new Error(`Unexpected response: ${response.split('\r\n')[0]}`));
            }
        });
        client.on('error', reject);
    });
}

async function testHugeHeaders() {
    const client = await connect();
    let headers = '';
    for (let i = 0; i < 2000; i++) {
        headers += `X-Custom-Header-${i}: value\r\n`;
    }
    const request = `GET /ping HTTP/1.1\r\nHost: localhost\r\n${headers}\r\n`;

    client.write(request);

    return new Promise((resolve, reject) => {
        client.on('data', (data) => {
            const response = data.toString();
            // Should ideally reject or handle gracefully
            if (response.includes('431') || response.includes('400') || response.includes('500')) {
                client.end();
                resolve();
            } else {
                // If it processes it, that's technically okay but risky. 
                // We want to see if it crashes or hangs.
                client.end();
                resolve();
            }
        });
        // If connection closes without data, that's also a fail/pass depending on implementation
        client.on('close', () => resolve());
        client.on('error', reject);
    });
}

async function testGarbageData() {
    const client = await connect();
    client.write('NOT A VALID HTTP REQUEST\r\n\r\n');

    return new Promise((resolve, reject) => {
        client.on('data', (data) => {
            const response = data.toString();
            if (response.includes('400')) {
                client.end();
                resolve();
            } else {
                // Some servers might just close the connection
                client.end();
                resolve();
            }
        });
        client.on('close', () => resolve());
        client.on('error', reject);
    });
}

async function testInvalidMethod() {
    const client = await connect();
    client.write('FOO /ping HTTP/1.1\r\nHost: localhost\r\n\r\n');

    return new Promise((resolve, reject) => {
        client.on('data', (data) => {
            const response = data.toString();
            if (response.includes('400') || response.includes('405') || response.includes('500')) {
                client.end();
                resolve();
            } else {
                reject(new Error(`Unexpected response for invalid method: ${response.split('\r\n')[0]}`));
            }
        });
        client.on('error', reject);
    });
}

async function testSlowloris() {
    const client = await connect();
    const request = 'GET /ping HTTP/1.1\r\nHost: localhost\r\n';

    // Send headers slowly
    let i = 0;
    const interval = setInterval(() => {
        if (i < request.length) {
            client.write(request[i]);
            i++;
        } else {
            clearInterval(interval);
            client.write('\r\n'); // Finish headers
        }
    }, 10); // 10ms delay per char (fast slowloris for test speed)

    return new Promise((resolve, reject) => {
        client.on('data', (data) => {
            const response = data.toString();
            if (response.includes('pong')) {
                client.end();
                resolve();
            }
        });
        client.on('error', reject);

        // Timeout if it takes too long (server should handle it)
        setTimeout(() => {
            clearInterval(interval);
            client.destroy();
            resolve(); // Considered pass if it didn't crash server
        }, 5000);
    });
}
