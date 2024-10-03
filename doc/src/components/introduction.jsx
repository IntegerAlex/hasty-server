
const Introduction = () => {
  return (
    <div className="p-6 bg-gray-900 shadow-lg rounded-lg md:p-8 lg:p-10">
      <h3 className="mb-6 text-gray-100">Introduction</h3>
      <p className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server is a lightweight, fast, and easy-to-use web server written entirely in 
        JavaScript, designed to serve static files and create powerful APIs without relying 
        on any dependencies. Its simplicity makes it suitable for a wide range of use cases, 
        from serving static content for personal websites to developing dynamic applications.
      </p>
      <p className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server is built to provide an intuitive experience while delivering robust 
        performance for web applications. It offers a straightforward API that allows you 
        to easily set up and configure your server.
      </p>
      <p className="mb-6 text-gray-300 leading-relaxed">
        Designed for modern web development, Hasty Server combines ease of use with the 
        flexibility to extend functionality through custom middleware and routing capabilities. 
        It empowers developers to create efficient web solutions without the overhead of 
        complex frameworks.
      </p>
      <h3 className="mt-10 mb-6 text-gray-100">Key Features</h3>
      <p className="mb-6 text-gray-300 leading-relaxed">
        Hasty Server offers a range of features that make it a powerful and flexible web server:
      </p>
      <ul className="list-disc list-inside mb-6 pl-6 text-gray-300 leading-relaxed">
        <li className="mb-2">
          <strong>API Development:</strong> Easily create robust APIs to handle client requests 
          and serve dynamic data, making it perfect for modern web applications.
        </li>
        <li className="mb-2">
          <strong>File Serving:</strong> Efficiently serve static files, including HTML, CSS, 
          JavaScript, and images, ensuring quick delivery to clients.
        </li>
        <li className="mb-2">
          <strong>Express-like Functionality:</strong> Hasty Server provides a simple, 
          intuitive API similar to Express.js, allowing developers to handle routing, middleware, 
          and request/response management effortlessly.
        </li>
        <li className="mb-2">
          <strong>High Performance:</strong> Optimized for speed and efficiency, capable of 
          handling multiple requests simultaneously.
        </li>
        <li className="mb-2">
          <strong>Extensible:</strong> Easily extend functionality with custom middleware 
          and plugins tailored to your specific needs.
        </li>
        <li className="mb-2">
          <strong>Secure:</strong> Built-in security features to protect your applications 
          and data.

        </li>
      </ul>
    </div>
  );
};

export default Introduction;

