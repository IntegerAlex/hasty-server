import Typography from "./general/typography";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const QuickStart = () => {
  return (
    <div className="p-6 bg-[#0F1115] shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography variant="h4" className="mb-6 text-[#A6A4A0] text-center md:text-left">
        Quick Start
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        Welcome to the Quick Start guide for Hasty Server. Follow these steps to
        get your server up and running quickly.
      </Typography>

      <Typography variant="h5" className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left">
        Step 1: Install Hasty Server
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        First, you need to install Hasty Server using npm. Run the following
        command in your terminal:
      </Typography>

      {/* SyntaxHighlighter for bash commands with enhanced style */}
      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
         $ npm install hasty-server
        </SyntaxHighlighter>
      </div>

      <Typography variant="h5" className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left">
        Step 2: Create a New Server
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC]  leading-relaxed"
      >
        Create a new JavaScript file (e.g., <code>server.js</code>) and add the
        following code to set up a basic Hasty Server:
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

      <Typography variant="h5" className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left">
        Step 3: Start the Server
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        Run the following command in your terminal to start the server:
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
         $ node server.js
        </SyntaxHighlighter>
      </div>

      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        Your server should now be running on port 8080. Open your browser and
        navigate to <code>http://localhost:8080</code> to see the "Hello World"
        message.
      </Typography>

      <Typography variant="h5" className="mt-10 mb-6 text-[#A6A4A0] text-center md:text-left">
        Step 4: Add More Routes
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        You can add more routes to your server by using the{" "}
        <code>server.get()</code> or <code>server.post()</code> methods. For
        example:
      </Typography>

      <div className="mb-6 rounded-lg overflow-hidden">
      <SyntaxHighlighter language="javascript" style={dracula} className="bg-[#090A0C] text-[#4D5D80] p-4 rounded-lg mb-6">
          {`server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});

server.post('/data', (req, res) => {
    res.send(JSON.stringify({ message: 'Data received!' }));
});`}
        </SyntaxHighlighter>
      </div>

      <Typography
        variant="body1"
        className="mb-6 text-[#B3B0AC] leading-relaxed"
      >
        This is a basic example to get you started with Hasty Server. For more
        advanced usage and features, refer to the full documentation.
      </Typography>
    </div>
  );
};

export default QuickStart;
