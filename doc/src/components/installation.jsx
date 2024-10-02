import Typography from "./general/typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Use darcula for a darker theme

const Installation = () => {
  return (
    <div className="p-6 bg-gray-900 shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-gray-100 text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server is a lightweight web framework for Node.js inspired by
        Express.js. The key difference is that instead of using the http module
        from Node.js, Hasty Server implements the HTTP protocol using raw TCP
        sockets through the net library. This framework is designed for
        developers who want to dive deeper into how HTTP works under the hood
        and learn how to build their own web servers.
      </Typography>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-gray-100 text-center md:text-left"
      >
        Features
      </Typography>
      <ul className="list-disc list-inside mb-6 text-gray-300 leading-relaxed space-y-4">
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Raw TCP Socket Handling:</strong> Implements the HTTP
            protocol using the net library instead of Node.js&apos;s http
            module.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Custom Request Parser:</strong> Parses HTTP requests,
            including headers and bodies, allowing developers to see how HTTP is
            structured.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Flexible Routing:</strong> Simple routing system to handle
            different HTTP methods like GET and POST.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>JSON Body Handling:</strong> Provides basic JSON body
            parsing to work with API requests.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Easy to Extend:</strong> Allows developers to add more
            features and customize how HTTP requests and responses are handled.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Lightweight:</strong> Minimal dependencies, focusing on
            simplicity and clarity.
          </Typography>
        </li>
      </ul>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-gray-100 text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        To install Hasty Server, run the following command:
      </Typography>
      <SyntaxHighlighter language="bash" style={darcula} className="mb-6">
        npm install hasty-server
      </SyntaxHighlighter>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-gray-100 text-center md:text-left"
      >
        Quick Start
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Here is a quick example to get you started with Hasty Server:
      </Typography>
      <SyntaxHighlighter language="javascript" style={darcula} className="mb-6">
        {`const Hasty = require('hasty-server');
const server = new Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});`}
      </SyntaxHighlighter>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-gray-100 text-center md:text-left"
      >
        Key Concepts
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server provides several key concepts to help you build your web
        server:
      </Typography>
      <Typography
        variant="h4"
        className="mt-8 mb-4 text-gray-100 text-center md:text-left"
      >
        Routing
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server provides basic routing functionality. Use{" "}
        <code>server.get()</code> or <code>server.post()</code> to handle
        specific routes.
      </Typography>
      <SyntaxHighlighter language="javascript" style={darcula} className="mb-6">
        {`server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});`}
      </SyntaxHighlighter>
      <Typography
        variant="h4"
        className="mt-8 mb-4 text-gray-100 text-center md:text-left"
      >
        Request Parsing
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Requests are parsed manually, allowing developers to learn the structure
        of HTTP requests including methods, paths, and bodies.
      </Typography>
      <Typography
        variant="h4"
        className="mt-8 mb-4 text-gray-100 text-center md:text-left"
      >
        Response Handling
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        Send responses using the <code>res.send()</code> method or return a
        status code with <code>res.sendStatus()</code>.
      </Typography>
      <SyntaxHighlighter language="javascript" style={darcula} className="mb-6">
        {`server.post('/data', (req, res) => {
    res.send(JSON.stringify({ message: 'Data received!' }));
});`}
      </SyntaxHighlighter>
    </div>
  );
};

export default Installation;
