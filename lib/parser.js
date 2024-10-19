// POST /api/users HTTP/1.1

const net = require("net");
const testRequest = require("../test/test.js");

// Helper function to find the position of the first occurrence of a target character
function findFirstBrac(req, target) {
  for (let i = 0; i < req.length; i++) {
    if (req[i] === target) {
      return i; // Return the position of the target character
    }
  }
  return -1;
}

// Parse HTTP body (handles asynchronous parsing)
async function HTTPbody(req, pos) {
  let body = "";
  return new Promise((resolve, reject) => {
    let flag = 0;
    for (let i = pos; i < req.length; i++) {
      if (req[i] === "{") {
        flag++;
      } else if (req[i] === "}") {
        flag--;
      }
      body += req[i];
      if (flag === 0 && req[i] === "}") break; // stop once the body has been fully captured
    }
    resolve(body.replace(/\s+/g, "").replace(/"/g, "")); // Clean up the body
  });
}

// Parse JSON body
function JSONbodyParser(body) {
  const req = body.split("");
  const httpJSON = {};
  while (req.length !== 0) {
    if (req[0] === "{" || req[0] === "}") {
      req.shift();
    } else {
      storePair(req, httpJSON);
    }
  }
  return httpJSON;
}

// Store a key-value pair from the request into the httpJSON object
function storePair(req, httpJSON) {
  let key = "";
  while (req[0] !== ":") {
    key += req.shift();
  }
  req.shift(); // Skip the colon
  let value = "";
  while (req[0] !== "," && req[0] !== "}") {
    value += req.shift();
  }
  if (req[0] === ",") req.shift(); // Skip the comma
  httpJSON[key] = value;
}

// Function to parse HTTP request headers and body
async function httpParser(rawRequest) {
  const req = {};
  const requestString = rawRequest.split("\n");
  const pos = findFirstBrac(requestString, "{");
  const requestWoBody = requestString.slice(0, pos);

  req.method = requestWoBody[0].split(" ")[0];
  req.path = requestString[0].split(" ")[1];
  req.version = requestString[0].split(" ")[2];

  if (req.method === "GET") {
    return req;
  }

  const bodyData = await HTTPbody(requestString, pos);
  req.body = JSONbodyParser(bodyData);

  return req;
}

// Query parsing function (parses query parameters from URL)
function queryParser(url) {
  const req = {};
  const pos = findFirstBrac(url, "?");
  const queryString = url.slice(pos + 1); // Slice starting after '?'

  const queryParams = queryString.split("&");
  queryParams.forEach((param) => {
    const [key, value] = param.split("=");
    req[key] = value;
  });

  return req;
}

// Example server using net module
net
  .createServer((socket) => {
    socket.on("data", (data) => {
      const rawData = data.toString();
      httpParser(rawData).then((parsedRequest) => {
        console.log(parsedRequest);
      });
    });
  })
  .listen(8080, () => {
    console.log("Server started on port 8080");
  });

// Example test case
console.log(queryParser("https://example.com?key=value&loda=lassan"));
