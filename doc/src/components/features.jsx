import Typography from "./general/typography";

const Features = () => {
  return (
    <div className="p-6 bg-white md:p-8 lg:p-10">
      <Typography variant="h5" className="mb-6 text-gray-800 text-center md:text-left">
        Features
      </Typography>
      <ul className="list-disc list-inside mb-6 text-gray-700 leading-relaxed space-y-6">
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-900">
            Fast
          </Typography>
          <Typography variant="body1">
            Hasty Server is built with Rust, ensuring high performance and low
            latency. It can handle a large number of requests per second, making
            it suitable for high-traffic applications.
          </Typography>
        </li>
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-900">
            Simple
          </Typography>
          <Typography variant="body1">
            Hasty Server offers a simple and intuitive API, making it easy to
            set up and use. Whether you&apos;re serving static files or building a
            complex web application, Hasty Server simplifies the process.
          </Typography>
        </li>
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-900">
            Secure
          </Typography>
          <Typography variant="body1">
            Security is a top priority for Hasty Server. It includes built-in
            security features to protect your applications from common web
            vulnerabilities and attacks.
          </Typography>
        </li>
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-900">
            Extensible
          </Typography>
          <Typography variant="body1">
            Hasty Server is highly extensible, allowing you to add custom
            middleware and plugins to extend its functionality. This makes it
            adaptable to a wide range of use cases.
          </Typography>
        </li>
        <li className="mb-4">
          <Typography variant="h5" className="text-gray-900">
            Lightweight
          </Typography>
          <Typography variant="body1">
            Despite its powerful features, Hasty Server remains lightweight,
            ensuring minimal resource usage and quick startup times.
          </Typography>
        </li>
      </ul>
    </div>
  );
};

export default Features;