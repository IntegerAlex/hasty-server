import Typography from "./general/typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dracula theme

const Installation = () => {
  return (
    <div className="p-6 bg-black shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-white text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-white text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-400 leading-relaxed">
        To install Hasty Server, run the following command:
      </Typography>

      {/* Improved SyntaxHighlighter with padding, font, and responsive design */}
      <div className="mb-6 rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language="bash"
          style={dracula}
          customStyle={{
            borderRadius: "8px",
            fontSize: "0.95rem",
            padding: "16px",
            backgroundColor: "#2d2d2d",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          npm install hasty-server
        </SyntaxHighlighter>
      </div>

      <Typography
        variant="h5"
        className="mt-10 mb-6 text-white text-center md:text-left"
      >
        Quick Start
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-400 leading-relaxed">
        Here is a quick example to get you started with Hasty Server:
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language="javascript"
          style={dracula}
          customStyle={{
            borderRadius: "8px",
            fontSize: "0.95rem",
            padding: "16px",
            backgroundColor: "#2d2d2d",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          {`const Hasty = require('hasty-server');
const server = new Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});`}
        </SyntaxHighlighter>
      </div>

      <Typography
        variant="h5"
        className="mt-10 mb-6 text-white text-center md:text-left"
      >
        Key Concepts
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-400 leading-relaxed">
        Hasty Server provides several key concepts to help you build your web
        server:
      </Typography>

      <Typography
        variant="h4"
        className="mt-8 mb-4 text-white text-center md:text-left"
      >
        Routing
      </Typography>
      <Typography variant="body1" className="mb-6 text-gray-400 leading-relaxed">
        Hasty Server provides basic routing functionality. Use{" "}
        <code>server.get()</code> or <code>server.post()</code> to handle
        specific routes.
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
        <SyntaxHighlighter
          language="javascript"
          style={dracula}
          customStyle={{
            borderRadius: "8px",
            fontSize: "0.95rem",
            padding: "16px",
            backgroundColor: "#2d2d2d",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
        >
          {`server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});`}
        </SyntaxHighlighter>
      </div>

      {/* Add more sections following the same style for consistency */}
    </div>
  );
};

export default Installation;
