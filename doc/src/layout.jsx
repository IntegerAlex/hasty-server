import { Link } from "react-router-dom";
import Header from "./components/header";
import Typography from "./components/general/typography";
import { CiMenuBurger, CiCircleChevLeft } from "react-icons/ci";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white">
      <Header />
      <div className="flex flex-1">
        <nav
          className={`w-48 bg-gray-900 p-4 ${
            isNavOpen ? "block" : "hidden"
          } md:block`}
        >
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                <Typography variant="body1">Introduction</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                <Typography variant="body1">Features</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/installation"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                <Typography variant="body1">Installation</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quickstart"
                className={({ isActive }) =>
                  `text-white hover:text-gray-300 ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                <Typography variant="body1">Quick Start</Typography>
              </NavLink>
            </li>
          </ul>
        </nav>
        {
// Updated the navigation button to replace the text labels with icons for better visual appeal and user experience.
// The button now uses <CiCircleChevLeft /> to indicate "Close Menu" and <CiMenuBurger /> for "Open Menu".
// Added Tailwind CSS class "text-2xl" for appropriate icon sizing.
        }
        <main className="flex-1 p-4 bg-gray-800 text-white">
          <button
            className="md:hidden mb-4 text-blue-500 text-2xl"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <CiCircleChevLeft /> : <CiMenuBurger />}
          </button>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
