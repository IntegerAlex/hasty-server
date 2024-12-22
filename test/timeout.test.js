const Hasty = require('../server/index.js');
const net = require('net');

// Create a test server
const server = new Hasty();
let serverStarted = false;

// Start server before tests
server.listen(3000, () => {
    console.log('Test server started on port 3000');
    serverStarted = true;
});

// Simple route for testing
server.get('/', (req, res) => {
    res.send('Hello World');
});

// Test timeout functionality
function testTimeout() {
    return new Promise((resolve, reject) => {
        // Create a client connection
        const client = new net.Socket();
        const startTime = Date.now();

        client.connect(3000, 'localhost', () => {
            console.log('Client connected');
        });

        client.on('close', () => {
            const duration = Date.now() - startTime;
            console.log(`Connection closed after ${duration}ms`);
            
            // Check if connection was closed around the 120000ms mark (2 minutes)
            if (duration >= 119000 && duration <= 121000) {
                console.log('✅ Test passed: Connection timed out as expected');
                resolve();
            } else {
                console.log('❌ Test failed: Connection did not timeout as expected');
                reject(new Error(`Unexpected timeout duration: ${duration}ms`));
            }
        });

        // Keep connection alive without sending data
        client.on('error', (err) => {
            if (err.code !== 'ECONNRESET') {
                console.error('Unexpected error:', err);
                reject(err);
            }
        });
    });
}

// Wait for server to start before running test
const interval = setInterval(() => {
    if (serverStarted) {
        clearInterval(interval);
        console.log('Starting timeout test (this will take 2 minutes)...');
        
        testTimeout()
            .then(() => {
                console.log('Test completed successfully');
                server.close();
                process.exit(0);
            })
            .catch((err) => {
                console.error('Test failed:', err);
                server.close();
                process.exit(1);
            });
    }
}, 100);
