import Typography from "./general/typography";

const Introduction = () => {
  return (
    <div className="p-6 bg-gray-900 shadow-lg rounded-lg md:p-8 lg:p-10">
      <Typography variant="h3" className="mb-6 text-gray-100">
        Introduction
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-300 leading-relaxed"
      >
        Hasty Server is a lightweight, fast, and easy-to-use web server that can
        be used to serve static files, as well as dynamic content. It is written
        in Rust, and is designed to be simple to use, while still providing
        powerful features.
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-300 leading-relaxed"
      >
        Hasty Server is designed to be easy to install and use, and is suitable
        for a wide range of use cases, from serving static files for a personal
        website, to serving dynamic content for a web application.
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-300 leading-relaxed"
      >
        Hasty Server is built on top of the{" "}
        <a
          href="https://expressjs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Express.js
        </a>{" "}
        web framework, and provides a simple and intuitive API for serving web
        content. It is designed to be easy to learn and use, while still
        providing powerful features for building web applications.
      </Typography>
      <Typography variant="h3" className="mt-10 mb-6 text-gray-100">
        Key Features
      </Typography>
      <Typography
        variant="body1"
        className="mb-6 text-gray-300 leading-relaxed"
      >
        Hasty Server offers a range of features that make it a powerful and
        flexible web server:
      </Typography>
      <ul className="list-disc list-outside mb-6 pl-6 text-gray-300 leading-relaxed">
        <li className="mb-2">
          <Typography variant="body1">
            <strong>High Performance:</strong> Built with Rust, Hasty Server is
            optimized for speed and efficiency.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Easy to Use:</strong> Simple API and configuration make it
            easy to get started.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Static and Dynamic Content:</strong> Serve both static files
            and dynamic content with ease.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Extensible:</strong> Easily extend functionality with
            middleware and plugins.
          </Typography>
        </li>
        <li className="mb-2">
          <Typography variant="body1">
            <strong>Secure:</strong> Built-in security features to protect your
            applications.
          </Typography>
        </li>
      </ul>
    </div>
  );
};

export default Introduction;
