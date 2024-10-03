import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
const HelloWorld = () => {
  return (
    <div className="p-6 bg-gray-900 shadow-lg rounded-lg md:p-8 lg:p-10">
      <h3 className="mb-6 text-gray-100">Hello World with Hasty Server</h3>
      <p className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server allows you to quickly set up a web server.
	Below is a simple example of how to create a "Hello World" server.
      </p>

      <h4 className="mt-6 mb-4 text-gray-100">Example</h4>
	<SyntaxHighlighter language="javascript" style={dracula} className="mb-6">
        {`
// Import Hasty Server
const Hasty = require('hasty-server');

// Create a new Hasty server instance
const server = new Hasty();

// Define a route for GET requests to the root URL
server.get('/', (req, res) => {
  console.log('GET /');
  res.send('Hello, World!');
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
        `}
</SyntaxHighlighter>
      <p className="mt-6 text-gray-300 leading-relaxed">
        The code above sets up a basic server using the Hasty framework. When a `GET` request is made 
        to the root (`/`) URL, it logs the request to the console and responds with "Hello, World!".
      </p>

      <h4 className="mt-6 mb-4 text-gray-100">Running the Server</h4>

      <p className="text-gray-300 leading-relaxed">
        To run this server, save the above code in a file, for example, <code>server.js</code>, and then run the 
        following command in your terminal:
      </p>

      <pre className="bg-gray-800 text-gray-200 p-4 rounded-lg">
       <SyntaxHighlighter language="javascript" style={dracula} className="mb-6">$ node server.js</SyntaxHighlighter>
      </pre>

      <p className="mt-6 text-gray-300 leading-relaxed">
        Open your browser and navigate to <strong>localhost:8080</strong>. You should see the "Hello, World!" message.
      </p>
    </div>
  );
};

export default HelloWorld;

