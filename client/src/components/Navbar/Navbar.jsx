import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black/80 backdrop-blur-md border-b border-gray-800 text-white fixed top-0 left-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-red-500">
          Me <span className="text-white">Play</span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium">
          {isAuthenticated ? (
            <>
              <div className="flex flex-1 mx-5 max-w-xl">
                <input
                  type="text"
                  placeholder="Search"
                  className="flex-1 px-4 py-2 border rounded-l-full focus:outline-none"
                />
                <button className="bg-red-600 text-white px-4 rounded-r-full hover:bg-red-700">
                  Search
                </button>
              </div>
              <li>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-500 font-semibold border-b-2 border-red-500 pb-1"
                      : "hover:text-red-400 transition-colors duration-300"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-red-500 font-semibold border-b-2 border-red-500 pb-1"
                      : "hover:text-red-400 transition-colors duration-300"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/upload"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold transition-all duration-300"
                >
                  Upload
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="hover:text-red-400 transition-colors duration-300"
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold transition-all duration-300"
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none text-gray-300 hover:text-white"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 border-t border-gray-800">
          <ul className="flex flex-col items-center py-4 space-y-4 font-medium">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink
                    to="/home"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-red-400"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-red-400"
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/upload"
                    onClick={() => setIsOpen(false)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold"
                  >
                    Upload
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-red-400"
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full font-semibold"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
