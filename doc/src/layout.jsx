import { Link } from "react-router-dom";
import Header from "./components/header";
import Typography from "./components/general/typography";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <div className="flex flex-1">
        <nav className={`w-64 bg-gray-100 p-4 ${isNavOpen ? "block" : "hidden"} md:block`}>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="text-blue-500 hover:underline">
                <Typography variant="body1">Introduction</Typography>
              </Link>
            </li>
            <li>
              <Link to="/features" className="text-blue-500 hover:underline">
                <Typography variant="body1">Features</Typography>
              </Link>
            </li>
            <li>
              <Link to="/installation" className="text-blue-500 hover:underline">
                <Typography variant="body1">Installation</Typography>
              </Link>
            </li>
            <li>
              <Link to="/quickstart" className="text-blue-500 hover:underline">
                <Typography variant="body1">Quick Start</Typography>
              </Link>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4">
          <button
            className="md:hidden mb-4 text-blue-500"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? "Close Menu" : "Open Menu"}
          </button>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;