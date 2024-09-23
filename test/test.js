const request = `POST /api/v1/users HTTP/1.1
Host: example.com
User-Agent: MyClient/1.0
Accept: application/json
Accept-Language: en-US,en;q=0.9
Accept-Encoding: gzip, deflate
Content-Type: application/json
Content-Length: 82
Connection: keep-alive
Authorization: Bearer your_access_token
Cache-Control: no-cache
Pragma: no-cache
If-None-Match: "some-etag-value"
X-Custom-Header: CustomValue

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "age": 30,
    "preferences": {
        "newsletter": true,
        "notifications": false
    }
}
`;

const query = `GET /api/users?key=value&loda=lassan HTTP/1.1
Host: www.example.com
User-Agent: MyCustomClient/1.0
Accept: application/json
`;

module.exports =  {request, query};
