import Header from "./components/header";
import Typography from "./components/general/typography";
import { useState } from "react";
import { NavLink } from "react-router-dom";
const Layout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav
          className={`w-64 bg-[#0F1115] p-4 transition-all duration-300 ease-in-out transform ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:block`}
        >
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-[#A6A4A0]  hover:text-gray-300 ${
                    isActive ? "bg-gray-800 text-blue-400 font-bold rounded-md" : ""
                  } p-2`
                }
              >
                <Typography variant="body1">Introduction</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-[#A6A4A0] hover:text-gray-300 ${
                    isActive ? "bg-gray-800 text-blue-400 font-bold rounded-md" : ""
                  } p-2`
                }
              >
                <Typography variant="body1">Features</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/installation"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-[#A6A4A0]  hover:text-gray-300 ${
                    isActive ? "bg-gray-800 text-blue-400 font-bold rounded-md" : ""
                  } p-2`
                }
              >
                <Typography variant="body1">Installation</Typography>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quickstart"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-[#A6A4A0]  hover:text-gray-300 ${
                    isActive ? "bg-gray-800 text-blue-400 font-bold rounded-md" : ""
                  } p-2`
                }
              >
                <Typography variant="body1">Quick Start</Typography> 
              
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/helloWorld"
                className={({ isActive }) =>
                  `flex items-center gap-3 text-[#A6A4A0]  hover:text-gray-300 ${
                    isActive ? "bg-gray-800 text-blue-400 font-bold rounded-md" : ""
                  } p-2`
                }
              >
                <Typography variant="body1">Hello World</Typography>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 bg-gray-800 text-[#A6A4A0] ">
          {/* Hamburger button for mobile */}
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
