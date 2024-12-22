const Hasty = require('../server/index.js');
const net = require('net');

// Increase timeout for all tests in this file
jest.setTimeout(150000); // 2.5 minutes to account for setup time

describe('Hasty Server Timeout', () => {
    let server;
    const TEST_PORT = 3001; // Use different port to avoid conflicts
    
    beforeAll(() => {
        server = new Hasty();
        server.get('/', (req, res) => {
            res.send('Hello World');
        });
    });

    afterAll(() => {
        server.close();
    });

    test('should timeout after 2 minutes of inactivity', done => {
        let serverStarted = false;
        
        server.listen(TEST_PORT, () => {
            serverStarted = true;
        });

        const waitForServer = () => {
            if (!serverStarted) {
                setTimeout(waitForServer, 100);
                return;
            }

            const client = new net.Socket();
            const startTime = Date.now();

            client.connect(TEST_PORT, 'localhost', () => {
                // Connection established
            });

            client.on('close', () => {
                const duration = Date.now() - startTime;
                
                try {
                    // Check if connection was closed around the 120000ms mark (2 minutes)
                    expect(duration).toBeGreaterThanOrEqual(119000);
                    expect(duration).toBeLessThanOrEqual(121000);
                    done();
                } catch (error) {
                    done(error);
                }
            });

            client.on('error', (err) => {
                if (err.code !== 'ECONNRESET') {
                    done(err);
                }
            });
        };

        waitForServer();
    });
});
