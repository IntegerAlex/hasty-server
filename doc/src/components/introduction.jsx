import Typography from "./general/typography";
const Introduction = () => {
  return (
    <div className=" bg-black w-full min-h-screen p-6 shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-white text-center md:text-left"
      >
        Introduction
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-400 leading-relaxed"
      >
        Hasty Server is a lightweight, fast, and easy-to-use web server written entirely in 
        JavaScript, designed to serve static files and create powerful APIs without relying 
        on any dependencies. Its simplicity makes it suitable for a wide range of use cases, 
        from serving static content for personal websites to developing dynamic applications.
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-400 leading-relaxed"
      >
        Hasty Server is built to provide an intuitive experience while delivering robust 
        performance for web applications. It offers a straightforward API that allows you 
        to easily set up and configure your server.
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-400 leading-relaxed"
      >
        Designed for modern web development, Hasty Server combines ease of use with the 
        flexibility to extend functionality through custom middleware and routing capabilities. 
        It empowers developers to create efficient web solutions without the overhead of 
        complex frameworks.
      </Typography>
      <Typography
        variant="h4"
        className="mb-6 text-white text-center md:text-left"
      >
        Key Features
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-400 leading-relaxed"
      >
        Hasty Server offers a range of features that make it a powerful and flexible web server:
      </Typography>
      <ul className="list-disc list-inside mb-6 pl-6 text-gray-400 leading-relaxed">
        <li className="mb-2">
          <strong className="text-gray-300">API Development:</strong> Easily create robust APIs to handle client requests 
          and serve dynamic data, making it perfect for modern web applications.
        </li>
        <li className="mb-2">
          <strong className="text-gray-300" >File Serving:</strong> Efficiently serve static files, including HTML, CSS, 
          JavaScript, and images, ensuring quick delivery to clients.
        </li>
        <li className="mb-2">
          <strong className="text-gray-300">Express-like Functionality:</strong> Hasty Server provides a simple, 
          intuitive API similar to Express.js, allowing developers to handle routing, middleware, 
          and request/response management effortlessly.
        </li>
        <li className="mb-2">
          <strong className="text-gray-300">High Performance:</strong> Optimized for speed and efficiency, capable of 
          handling multiple requests simultaneously.
        </li>
        <li className="mb-2">
          <strong className="text-gray-300">Extensible:</strong> Easily extend functionality with custom middleware 
          and plugins tailored to your specific needs.
        </li>
        <li className="mb-2">
          <strong className="text-gray-300">Secure:</strong> Built-in security features to protect your applications 
          and data.

        </li>
      </ul>
    </div>
  );
};

export default Introduction;

