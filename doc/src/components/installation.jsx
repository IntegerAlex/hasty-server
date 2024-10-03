import Typography from "./general/typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Dracula theme

const Installation = () => {
  return (
    <div className="p-6 bg-[#0F1115] shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-[#A6A4A0] text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography
        variant="h5"
        className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left"
      >
        Installation
      </Typography>
      <Typography variant="body1" className="mb-6 text-[#B3B0AC] leading-relaxed">
        To install Hasty Server, run the following command:
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
         $ npm install hasty-server
        </SyntaxHighlighter>
      </div>

      <Typography
        variant="h5"
        className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left"
      >
        Quick Start
      </Typography>
      <Typography variant="body1" className="mb-6 text-[#B3B0AC] leading-relaxed">
        Here is a quick example to get you started with Hasty Server:
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
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
        className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left"
      >
        Key Concepts
      </Typography>
      <Typography variant="body1" className="mb-6 text-[#B3B0AC] leading-relaxed">
        Hasty Server provides several key concepts to help you build your web
        server:
      </Typography>

      <Typography
        variant="h4"
        className="mt-8 mb-4 text-[#A6A4A0] text-center md:text-left"
      >
        Routing
      </Typography>
      <Typography variant="body1" className="mb-6 text-[#B3B0AC] leading-relaxed">
        Hasty Server provides basic routing functionality. Use{" "}
        <code>server.get()</code> or <code>server.post()</code> to handle
        specific routes.
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
          {`server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default Installation;
