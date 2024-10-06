function findFirstBrac(req, target) {
    for (let i = 0; i < req.length; i++) {
        if (req[i] === target) {
            return i;
        }
    }
    return -1;
}

function HTTPbody(req, pos) {
    let flag = 0;
    let body = "";
    return new Promise((resolve, reject) => {
        const position = pos;
        for (let i = position; i < req.length; i++) {
            if (req[i] == "{") {
                flag++;
                body += req[i];
            } else if (req[i] == "}") {
                flag--;
                body += req[i];
            } else {
                body += req[i];
            }
        }

        // Simple whitespace cleanup
        const cleanedBody = cleanUpBody(body);
        resolve(cleanedBody);
    });
}

function cleanUpBody(body) {
    // Trim leading and trailing spaces
    body = body.trim();

    // Replace multiple spaces with a single space
    body = body.split(/\s+/).join(' ');

    // Manually handle spaces around colons and commas
    body = body.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

    return body;
}

function JSONbodyParser(body) {
    const req = body.split("");
    const httpJSON = new Object();
    let flag = 0;
    let pos = 0;

    // Check for empty input
    if (req.length < 1) return httpJSON;

    while (req.length > 0) {
        if (req[0] == "{") {
            flag++;
            req.shift();  // Move past the '{'
        } else if (req[0] == "}") {
            flag--;
            req.shift();  // Move past the '}'
        } else {
            storePair(req, httpJSON);
        }
    }

    return httpJSON;
}

function storePair(req, httpJSON) {
    let key = "";
    let value = "";
    
    // Parse the key
    while (req.length > 0 && req[0] !== ":") {
        if (req[0] !== '"' && req[0] !== ' ') {
            key += req[0];  // Collect characters for the key
        }
        req.shift();  // Move the pointer forward
    }
    
    if (req.length < 1) return; // Exit if we reach the end of input without finding a key-value pair
    req.shift();  // Skip over the colon ':'

    // Parse the value
    if (req.length > 0 && req[0] === "{") {
        req.shift();  // Remove the '{'
        let nestedObject = {};
        while (req.length > 0 && req[0] !== "}") {
            storePair(req, nestedObject);  // Store key-value pairs into the nested object
        }
        req.shift();  // Remove the closing '}'
        httpJSON[key.trim()] = nestedObject;  // Assign the nested object to the parent
    } else {
        // Handle primitive values (strings, numbers, etc.)
        value = parseValue(req);
        httpJSON[key.trim()] = value;  // Store the key-value pair
    }

    return req;
}

// Helper function to parse primitive values (strings, numbers, etc.)
function parseValue(req) {
    let value = "";
    let isString = false;

    // Check if the value starts with a quote
    if (req[0] === '"') {
        isString = true;
        req.shift();  // Remove the starting quote
    }

    while (req.length > 0 && req[0] !== "," && req[0] !== "}" && req[0] !== "]") {
        if (isString) {
            // For strings, accumulate characters until the closing quote
            if (req[0] === '"') {
                req.shift();  // Remove the closing quote
                break;  // Exit the loop after closing quote
            } else {
                value += req[0];
            }
        } else {
            // For non-strings (numbers, etc.), accumulate characters directly
            value += req[0];
        }
        req.shift();  // Move the pointer forward
    }

    if (req[0] === ",") req.shift();  // Skip the comma between pairs

    // Handle numbers (check if it's a valid number string)
    if (!isString && !isNaN(Number(value))) {
        return Number(value);  // Return as a number if it can be converted
    }

    return isString ? value.trim() : value.trim();  // Return the value
}

function queryParser(request) {
    const httpQueryJSON = new Object();
    const queryStart = request.indexOf("?");

    if (queryStart === -1) {
        console.log("No query parameters found.");
        return httpQueryJSON;
    }

    const queryString = request.slice(queryStart + 1).split("&");

    for (let i = 0; i < queryString.length; i++) {
        const [key, value] = queryString[i].split("=");
        if (key) {
            httpQueryJSON[key] = value || "";
        }
    }

    console.log(httpQueryJSON);
    return httpQueryJSON;
}

const mimeDb = require('./mimeDb'); // Adjust the path as needed

function lookupMimeType(extension) {
  const mimeType = Object.keys(mimeDb).find(type =>
    mimeDb[type].extensions.includes(extension)
  );
  return mimeType || 'application/octet-stream'; // Default type
}

// Example usage:


module.exports = { findFirstBrac, HTTPbody, JSONbodyParser, queryParser ,lookupMimeType };

