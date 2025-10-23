import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import { FaHome } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";
import { IoCloudUpload, IoSettingsSharp } from "react-icons/io5";

function Navbar() {
  const { isAuthenticated } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-black/90 text-white z-50 shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="text-2xl font-extrabold text-red-500 cursor-pointer">
          {isMobile ? (
            <>M<span className="text-white">Play</span></>
          ) : (
            <>Me<span className="text-white">Play</span></>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 font-medium items-center">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <FaHome size={18} /> Home
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <MdSpaceDashboard size={18} /> Dashboard
              </NavLink>
              <NavLink
                to="/upload"
                className="flex items-center gap-2 hover:text-red-400"
              >
                <IoCloudUpload size={18} /> Upload
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 ${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <IoSettingsSharp size={18} /> Settings
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-red-400">
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="bg-red-600 px-3 py-1.5 rounded-md hover:bg-red-700 font-semibold"
              >
                Register
              </NavLink>
            </>
          )}
        </nav>

        {/* Mobile Navigation (Icons only) */}
        <nav className="flex md:hidden gap-5 items-center text-gray-200">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <FaHome size={22} />
              </NavLink>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <MdSpaceDashboard size={22} />
              </NavLink>
              <NavLink
                to="/upload"
                className="hover:text-red-400"
              >
                <IoCloudUpload size={22} />
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `${isActive ? "text-red-500" : "hover:text-red-400"}`
                }
              >
                <IoSettingsSharp size={22} />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-red-400 text-lg">
                🔐
              </NavLink>
              <NavLink to="/register" className="hover:text-red-400 text-lg">
                📝
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
