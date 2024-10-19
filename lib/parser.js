const net = require("net");
const testRequest = require("../test/test.js");

// Helper function to find the position of the first occurrence of a target character
function findFirstBrac(req, target) {
  for (let i = 0; i < req.length; i++) {
    if (req[i] === target) {
      return i; // Return the position of the target character
    }
  }
  return -1; // Return -1 if target character is not found
}

// Parse HTTP body (handles asynchronous parsing and rejects on error)
async function HTTPbody(req, pos) {
  let body = "";
  return new Promise((resolve, reject) => {
    let flag = 0;
    try {
      for (let i = pos; i < req.length; i++) {
        if (req[i] === "{") {
          flag++;
        } else if (req[i] === "}") {
          flag--;
        }
        body += req[i];
        if (flag === 0 && req[i] === "}") break; // Stop once the body has been fully captured
      }
      resolve(body.replace(/\s+/g, "").replace(/"/g, "")); // Clean up the body
    } catch (error) {
      reject(`Error parsing HTTP body: ${error.message}`);
    }
  });
}

// Parse JSON body
function JSONbodyParser(body) {
  const req = body.split("");
  const httpJSON = {};
  while (req.length !== 0) {
    if (req[0] === "{" || req[0] === "}") {
      req.shift(); // Skip braces
    } else {
      storePair(req, httpJSON); // Store key-value pair
    }
  }
  return httpJSON;
}

// Store a key-value pair from the request into the httpJSON object
function storePair(req, httpJSON) {
  let key = "";
  while (req[0] !== ":") {
    key += req.shift(); // Collect characters until colon
  }
  req.shift(); // Skip the colon
  let value = "";
  while (req[0] !== "," && req[0] !== "}") {
    value += req.shift(); // Collect value until comma or closing brace
  }
  if (req[0] === ",") req.shift(); // Skip the comma
  httpJSON[key] = value; // Store key-value pair in JSON object
}

// Function to parse HTTP request headers and body
async function HTTPbody(req, pos) {
  let body = "";
  let flag = 0;

  for (let i = pos; i < req.length; i++) {
    if (req[i] === "{") {
      flag++;
    } else if (req[i] === "}") {
      flag--;
    }
    body += req[i];

    // Simulating an asynchronous operation with a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 0)); // This simulates yielding control, allowing for asynchronous flow

    if (flag === 0 && req[i] === "}") break; // Stop once the body has been fully captured
  }

  // Return cleaned-up body after parsing
  return body.replace(/\s+/g, "").replace(/"/g, ""); // Clean up the body
}

// Query parsing function (parses query parameters from URL)
function queryParser(url) {
  const req = {};
  const pos = findFirstBrac(url, "?");
  if (pos === -1) return req; // Return empty object if no query parameters

  const queryString = url.slice(pos + 1); // Slice starting after '?'
  const queryParams = queryString.split("&");

  queryParams.forEach((param) => {
    const [key, value] = param.split("=");
    req[key] = value || ""; // Store key-value pair, handle empty values
  });

  return req;
}

// Example server using net module
net
  .createServer((socket) => {
    socket.on("data", (data) => {
      const rawData = data.toString();
      httpParser(rawData)
        .then((parsedRequest) => {
          // Example of parsed request, uncomment to log it
          // console.log(parsedRequest);
        })
        .catch((err) => {
          console.error("Error while parsing request:", err);
        });
    });
  })
  .listen(8080, () => {
    // Example of server startup message, uncomment to log it
    // console.log("Server started on port 8080");
  });

// Example test case, uncomment to test query parsing
// console.log(queryParser("https://example.com?key=value&foo=bar"));
