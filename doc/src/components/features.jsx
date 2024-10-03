import Typography from "./general/typography";

const Features = () => {
  return (
    <div className="p-6 bg-black shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography
        variant="h4"
        className="mb-6 text-gray-100 text-center md:text-left font-bold"
      >
        Key Features of Hasty Server
      </Typography>

      <ul className="list-disc list-inside mb-6 text-gray-300 leading-relaxed space-y-6">
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • High Performance
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Hasty Server is designed for speed. It’s built using low-level
            networking APIs, ensuring minimal overhead and high concurrency.
            This makes it capable of handling thousands of requests per second
            with ease, perfect for high-traffic applications.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Developer Friendly
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            It offers a simple and intuitive API, inspired by Express.js.
            Whether you’re a beginner or an experienced developer, the clear
            structure and easy-to-use syntax allow you to build applications
            faster and with fewer bugs.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Built-in Security
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Security is a top priority. Hasty Server includes built-in
            protections against common vulnerabilities such as XSS (Cross-Site
            Scripting), CSRF (Cross-Site Request Forgery), and SQL injection,
            helping you create secure applications without extra effort.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Extensible Architecture
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            With its middleware-based architecture, Hasty Server allows you to
            add custom plugins and middlewares. You can extend its functionality
            by adding your own handlers or integrating third-party libraries
            with ease.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Lightweight & Minimal
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Despite its powerful features, Hasty Server remains lightweight and
            efficient. It minimizes resource consumption, making it ideal for
            resource-constrained environments such as microservices or
            serverless applications.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Scalable
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Whether you are building a small personal project or a large-scale
            enterprise application, Hasty Server scales effortlessly. Its
            modular design lets you efficiently manage growing traffic and
            users.
          </Typography>
        </li>

        <li className="mb-4">
          <Typography variant="h5" className="text-gray-100 font-semibold">
            • Flexible Routing
          </Typography>
          <Typography variant="body1" className="text-gray-400">
            Hasty Server provides a flexible routing system, allowing you to
            define routes for different HTTP methods (GET, POST, PUT, DELETE,
            etc.). You can also create dynamic routes with parameters for even
            more customization.
          </Typography>
        </li>
      </ul>
    </div>
  );
};

export default Features;
