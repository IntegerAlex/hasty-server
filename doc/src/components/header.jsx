import Typography from "./general/typography";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center md:px-20">
      <div className="flex items-center">
        <Typography variant="h6">Hasty Server</Typography>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a
              href="https://www.npmjs.com/package/hasty-server"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body1">Package Download</Typography>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
