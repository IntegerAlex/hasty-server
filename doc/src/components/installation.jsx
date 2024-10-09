import Typography from "./general/typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Use darcula for a darker theme

const Installation = () => {
  return (
    <div className="p-6 bg-black shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-gray-100 text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-gray-100 text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-300 leading-relaxed">
        To install Hasty Server, run the following command:
      </Typography>
      <SyntaxHighlighter language="bash" style={dracula} className="mb-6">
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
      <SyntaxHighlighter language="javascript" style={dracula} className="mb-6">
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
      <SyntaxHighlighter language="javascript" style={dracula} className="mb-6">
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
      <SyntaxHighlighter language="javascript" style={dracula} className="mb-6">
        {`server.post('/data', (req, res) => {
    res.send(JSON.stringify({ message: 'Data received!' }));
});`}
      </SyntaxHighlighter>
    </div>
  );
};

export default Installation;
