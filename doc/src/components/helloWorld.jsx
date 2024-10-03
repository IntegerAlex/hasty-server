import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Typography from "./general/typography";
const HelloWorld = () => {
  return (
    <div className="p-6 bg-[#0F1115] shadow-lg rounded-lg md:p-8 lg:p-10">
       <Typography
        variant="h4"
        className="mb-6 text-[#A6A4A0]  text-center md:text-left"
      >
        Installation
      </Typography>
      <p className="mb-6 text-[#A6A4A0] leading-relaxed">
        Hasty Server allows you to quickly set up a web server.
	Below is a simple example of how to create a "Hello World" server.
      </p>

      <Typography
        variant="h4"
        className="mb-6 text-[#A6A4A0]  text-center md:text-left"
      >
        Example
      </Typography>
	<SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6 ">
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
      <p className="mt-6 text-[#A6A4A0] leading-relaxed mb-6">
        The code above sets up a basic server using the Hasty framework. When a `GET` request is made 
        to the root (`/`) URL, it logs the request to the console and responds with "Hello, World!".
      </p>

      <Typography
        variant="h4"
        className="mb-6 text-[#A6A4A0]  text-center md:text-left"
      >Running the Server</Typography>

      <p className="text-[#A6A4A0] leading-relaxed">
        To run this server, save the above code in a file, for example, <code>server.js</code>, and then run the 
        following command in your terminal:
      </p>

      <pre className="bg-[#090A0C] text-gray-200 p-4 rounded-lg">
       <SyntaxHighlighter language="javascript" style={dracula} className="mb-6">$ node server.js</SyntaxHighlighter>
      </pre>

      <p className="mt-6 text-[#A6A4A0] leading-relaxed">
        Open your browser and navigate to <strong>localhost:8080</strong>. You should see the "Hello, World!" message.
      </p>
    </div>
  );
};

export default HelloWorld;