import Typography from './general/typography'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula, coy } from 'react-syntax-highlighter/dist/esm/styles/prism'

const QuickStart = () => {
  return (
    <div className='p-6 bg-gray-900 shadow-lg rounded-lg md:p-8 lg:p-10'>
      <Typography variant='h4' className='mb-6 text-gray-100'>
        Quick Start
      </Typography>
      <Typography
        variant='body1'
        className='mb-6 text-gray-300 leading-relaxed'
      >
        Welcome to the Quick Start guide for Hasty Server. Follow these steps to
        get your server up and running quickly.
      </Typography>
      <Typography variant='h5' className='mt-10 mb-6 text-gray-100'>
        Step 1: Install Hasty Server
      </Typography>
      <Typography
        variant='body1'
        className='mb-6 text-gray-300 leading-relaxed'
      >
        First, you need to install Hasty Server using npm. Run the following
        command in your terminal:
      </Typography>
      <SyntaxHighlighter language='bash' style={dracula} className='mb-6'>
        npm install hasty-server
      </SyntaxHighlighter>
      <Typography variant='h5' className='mt-10 mb-6 text-gray-100'>
        Step 2: Create a New Server
      </Typography>
      <Typography
        variant='body1'
        className='mb-6 text-gray-300 leading-relaxed'
      >
        Create a new JavaScript file (e.g., <code>server.js</code>) and add the
        following code to set up a basic Hasty Server:
      </Typography>
      <SyntaxHighlighter language='javascript' style={dracula} className='mb-6'>
        {`const Hasty = require('hasty-server');
const server = new Hasty();

server.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(8080, () => {
    console.log('Server is running on port 8080');
});`}
      </SyntaxHighlighter>
      <Typography variant='h5' className='mt-10 mb-6 text-gray-100'>
        Step 3: Start the Server
      </Typography>
      <Typography
        variant='body1'
        className='mb-6 text-gray-300 leading-relaxed'
      >
        Run the following command in your terminal to start the server:
      </Typography>
      <SyntaxHighlighter language='bash' style={dracula} className='mb-6'>
        node server.js
      </SyntaxHighlighter>
      <Typography
        variant='body1'
        className='mb-6 text-gray-100 leading-relaxed'
      >
        Your server should now be running on port 8080. Open your browser and
        navigate to <code>http://localhost:8080</code> to see the &quot;Hello
        World&quot; message.
      </Typography>
      <Typography variant='h5' className='mt-10 mb-6 text-gray-100'>
        Step 4: Add More Routes
      </Typography>
      <Typography
        variant='body1'
        className='mb-6 text-gray-300 leading-relaxed'
      >
        You can add more routes to your server by using the{' '}
        <code>server.get()</code> or <code>server.post()</code> methods. For
        example:
      </Typography>
      <SyntaxHighlighter language='javascript' style={dracula} className='mb-6'>
        {`server.get('/home', (req, res) => {
    res.send('Welcome to the Home Page');
});

server.post('/data', (req, res) => {
    res.send(JSON.stringify({ message: 'Data received!' }));
});`}
      </SyntaxHighlighter>
      <Typography
        variant='body1'
        className='mb-6 text-gray-700 leading-relaxed'
      >
        This is a basic example to get you started with Hasty Server. For more
        advanced usage and features, refer to the full documentation.
      </Typography>
    </div>
  )
}

export default QuickStart
