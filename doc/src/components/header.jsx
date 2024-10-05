import Typography from "./general/typography";

const Header = () => {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center md:px-20">
      <div className="flex items-center">
        <img
          src="../../logo.png"
          alt="Hasty Server Logo"
          className="w-20"
        />
      </div>
      <nav>
        <ul className="flex space-x-4">
        <li>
            <a
              href="https://github.com/IntegerAlex/hasty-server"
              className="text-[#f3ce1f] hover:text-[#a89223]"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography variant="body1">view on github</Typography>
            </a>
          </li>
          <li>
            <a
              href="https://www.npmjs.com/package/hasty-server"
              className="text-[#f3ce1f] hover:text-[#a89223]"
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
