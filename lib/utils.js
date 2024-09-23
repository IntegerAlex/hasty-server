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
            }
            body += req[i];
        }
        resolve(body.replace(/\s+/g, '').replace(/"/g, ''));
    });
}

function JSONbodyParser(body) {
    const req = body.split("");
    const httpJSON = new Object();
    let flag = 0;
    let pos = 0;

    while (req.length != 0) {
        if (req[0] == "{") {
            flag++;
            pos++;
            req.shift();
        } else if (req[0] == "}") {
            flag--;
            pos++;
            req.shift();
        } else {
            storePair(req, httpJSON);
        }
    }

    return httpJSON;
}

function storePair(req, httpJSON) {
    let key = "";
    let i = 0;

    while (req[i] != ":") {
        key += req[i];
        req.shift();
    }
    req.shift();

    let value = "";
    i = 0;

    while (req[i] != ",") {
        if (req[i] == null) {
            break;
        }
        value += req[i];
        req.shift();
    }
    req.shift();

    httpJSON[key] = value;
    return req;
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

module.exports = { findFirstBrac, HTTPbody, JSONbodyParser, queryParser };

