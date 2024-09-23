const { findFirstBrac, HTTPbody, JSONbodyParser, queryParser } = require('./utils.js');

async function httpParser(request) {
    const req = new Object();
    const requestString = request.split("\n");
    const pos = findFirstBrac(requestString, "{");
    const requestWoBody = requestString.slice(0, pos);

    req.method = requestWoBody[0].split(" ")[0];
    req.path = requestString[0].split(" ")[1];
    req.version = requestString[0].split(" ")[2];

    if (req.method == "GET") {
        req.query = queryParser(req.path);
        return req;
    }

    HTTPbody(requestString, pos)
        .then((data) => {
            req.body = JSONbodyParser(data);
            console.log(req);
        });

    return req;
}

module.exports = { httpParser };

