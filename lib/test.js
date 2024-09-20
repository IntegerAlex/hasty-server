const request = require('../test/test.js'); // Importing the test request for parsing
const net = require('net'); // Importing the net module for creating a TCP server

// Uncomment this section to start a TCP server
// net.createServer((socket) => {
//     socket.on('data', (data) => {
//         console.log(data); // Log the incoming data
//         const buff = data.toString(); // Convert buffer data to string
//         console.log(buff); // Log the string data
//         httpParser(buff); // Parse the HTTP request
//     });
// }).listen(8080, () => {
//     console.log("server started"); // Log server start message
// });

function findFirstBrac(req, target) {
    // Iterate through the request to find the first occurrence of the target character
    for (let i = 0; i < req.length; i++) {
        if (req[i] === target) {
            return i; // Return the position of the target character
        }
    }
    return -1; // Return -1 if not found
}

// Function to parse the HTTP request
async function httpParser(request) {
    const req = new Object(); // Create a new object for the request
    const requestString = request.split("\n"); // Split the request into lines
    const pos = findFirstBrac(requestString, "{"); // Find the position of the first '{'
    const requestWoBody = requestString.slice(0, pos); // Extract request lines without the body
    
    // Set method, path, and version from the request
    req.method = requestWoBody[0].split(" ")[0];
    req.path = requestString[0].split(" ")[1];
    req.version = requestString[0].split(" ")[2];
    
    if (req.method == "GET") {
        return req; // Return if the method is GET
    }
    
    // Parse the body and assign it to the request object
    HTTPbody(requestString, pos)
        .then((data) => {
            req.body = JSONbodyParser(data); // Parse the body as JSON
            console.log(req); // Log the complete request object
        });

    return req; // Return the request object
}

// Test call to httpParser (uncomment for testing)
// httpParser("POST /api/users HTTP/1.1 \nhost:www.google.com");

// Example of measuring execution time (uncomment for testing)
// console.time('Execution Time');
// JSONbodyParser("{key:value,loda:lassan,}");
// console.time();

httpParser(request).then((data) => {
    console.log(data); // Log the parsed data
});

// Function to store key-value pairs from the parsed JSON body
function storePair(req, httpJSON) {
    let key = "";
    let i = 0;
    
    // Extract the key until a ':' is found
    while (req[i] != ":") {
        key += req[i];
        req.shift(); // Remove the processed character
    }
    req.shift(); // Remove the ':' character

    let value = "";
    i = 0;
    
    // Extract the value until a ',' is found
    while (req[i] != ",") {
        if (req[i] == null) {
            break; // Exit if there are no more characters
        }
        value += req[i];
        req.shift(); // Remove the processed character
    }
    req.shift(); // Remove the ',' character
    
    httpJSON[key] = value; // Store the key-value pair in the JSON object
    return req; // Return the remaining characters
}

// Function to parse the JSON body from the HTTP request
function JSONbodyParser(body) {
    const req = body.split(""); // Split body into characters
    const httpJSON = new Object(); // Create an object for JSON data
    let flag = 0; // To track the depth of JSON brackets
    let pos = 0; // Position tracker

    while (req.length != 0) {
        if (req[0] == "{") {
            flag++; // Increase depth on '{'
            pos++;
            req.shift(); // Remove '{'
        } else if (req[0] == "}") {
            flag--; // Decrease depth on '}'
            pos++;
            req.shift(); // Remove '}'
        } else {
            storePair(req, httpJSON); // Process key-value pairs
        }
    }

    // Log the remaining characters, depth flag, and parsed JSON
    console.log(req + flag + pos);
    console.log(httpJSON);
    return httpJSON; // Return the parsed JSON object
}

// Function to extract the body from the HTTP request
function HTTPbody(req, pos) {
    let flag = 0; // To track the depth of JSON brackets
    let body = ""; // To accumulate the body content
    return new Promise((resolve, reject) => {
        const position = pos; // Save the starting position

        // Iterate from the position to extract the body
        for (let i = position; i < req.length; i++) {
            if (req[i] == "{") {
                flag++;
                body += req[i]; // Append '{' to body
            } else if (req[i] == "}") {
                flag--;
                body += req[i]; // Append '}' to body
            }
            body += req[i]; // Append current character to body
        }
        
        // Log the depth flag
        console.log(flag);
        // Resolve the promise with the cleaned body (whitespace and quotes removed)
        resolve(body.replace(/\s+/g, '').replace(/"/g, ''));
    });
}

// Function to parse query parameters from the request URL
// Example call to parse a query string (uncomment for testing)
 queryParser("https//:fhdfjdh.com?key=value&loda=lassan");
// Function to parse query parameters from the request URL
async function queryParser(request) {
    const httpQueryJSON = {}; // Create an object for query parameters
    const queryStart = request.indexOf("?"); // Find the position of '?'

    // Check if there are any query parameters in the URL
    if (queryStart === -1) {
        console.log("No query parameters found.");
        return httpQueryJSON; // Return empty object if no query string
    }

    // Extract the query string from the URL
    const queryString = request.slice(queryStart + 1).split("&");

    // Iterate over each key-value pair in the query string
    for (let i = 0; i < queryString.length; i++) {
        const [key, value] = queryString[i].split("=");
        if (key) {
            httpQueryJSON[key] = value || ""; // Add key-value pairs to the JSON object
        }
    }

    console.log(httpQueryJSON); // Log the parsed query parameters
    return httpQueryJSON; // Return the parsed query parameters
}

// Example call to test the refactored query parser
queryParser("https://example.com?key=value&foo=bar&baz=qux");

