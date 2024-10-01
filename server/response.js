class Response {
    statusCode = 200; // Default status code
    statusTextMap = {
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        204: 'No Content',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other',
        304: 'Not Modified',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        409: 'Conflict',
        417: 'Expectation Failed',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        503: 'Service Unavailable'
        //... Add more status codes as needed
    }; // Map of status codes to status text

    constructor(socket) {
        this.socket = socket;
    }

    // Method to set status code
    status(code) {
        if (this.statusTextMap[code] === undefined) {
            throw new Error(`Invalid status code: ${code}`);
        }
      
        this.statusCode = code;
        return this;
    }

    // Method to set headers
    setHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    // Method to send a response with a body
    send(body) {
        const response = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\n\n${body}`;
        this.socket.write(response); // Send the complete response
        this.socket.end(); // End the connection
    }

    // Method to send only the status
    sendStatus(statusCode) {
	    const response = `HTTP/1.1 ${statusCode} ${this.statusTextMap[this.statusCode]} \n\n`;
	    this.socket.write(response); // Send the complete response
        this.socket.end(); // End the connection
    }

    // Helper method to format headers
    formatHeaders() {
        return Object.keys(this.headers)
            .map(key => `${key}: ${this.headers[key]}`)
            .join('\r\n');
    }
  
  // Send Json response
	json(data) {
		data = JSON.stringify(data);
		const  response = `HTTP/1.1 ${this.statusCode} ${this.statusTextMap[this.statusCode]}\nContent-Type: application/json\n\n${data}`;
		this.socket.write(response); // Send the complete response
    this.socket.end(); // End the connection
	}
}

module.exports = Response;

