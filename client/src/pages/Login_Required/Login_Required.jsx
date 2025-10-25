import React, { useContext, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from '../../utils/authContext';

function Login_Required() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true })
  }, [isAuthenticated, navigate])
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-950 text-white px-6">
      {/* Image / Illustration */}
      <img
        src="/images/access-denied.svg"
        alt="Login required"
        className="w-64 md:w-80 mb-10 drop-shadow-lg animate-bounce-slow"
      />

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-red-500 tracking-tight">
        Access Denied
      </h1>

      {/* Message */}
      <p className="text-gray-300 text-center max-w-md mb-8">
        You need to be logged in to view this page.
        Please login to continue exploring <span className="text-red-400 font-semibold">MePlay</span> and enjoy exclusive content.
      </p>

      {/* Login Button */}
      <NavLink
        to="/login"
        className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full font-semibold text-white transition-all duration-300 shadow-lg"
      >
        Go to Login
      </NavLink>
    </div>
  );
}

export default Login_Required;
