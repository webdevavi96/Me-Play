import React, { useContext, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from '../../utils/authContext';

function Landing() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <>
      <div className="w-full min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col">

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 md:py-32 gap-8">
          <div className="flex-1 w-full space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              Me <span className="text-red-500">Play</span>
            </h1>
            <h2 className="text-lg md:text-xl text-gray-300 max-w-xl">
              India’s new leading <span className="text-red-400 font-semibold">video streaming platform</span> for seamless entertainment.
            </h2>
            <p className="text-gray-400 max-w-md">
              Join us now, share your videos with the world, and start your journey to becoming a celebrity.
            </p>
            <NavLink
              to="/login"
              className="inline-block mt-4 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-all duration-300"
            >
              Get Started
            </NavLink>
          </div>

          <div className="flex-1 w-full flex justify-center">
            <img
              src="/images/boy.jpg"
              alt="hero"
              className="rounded-2xl shadow-2xl max-w-full md:max-w-md hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* Info Section */}
        <section className="flex flex-col-reverse md:flex-row items-center justify-between bg-gray-950 px-6 md:px-16 py-16 gap-10">
          <div className="flex-1 w-full flex justify-center">
            <img
              src="/images/girl.jpg"
              alt="creator"
              className="rounded-2xl shadow-lg max-w-full md:max-w-md hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 w-full space-y-5 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold">
              Create. Stream. Inspire.
            </h2>
            <p className="text-gray-400 max-w-lg">
              Upload your content and connect with millions of viewers. MePlay empowers creators like you to shine on the digital stage.
            </p>
            <NavLink
              to="/register"
              className="inline-block mt-4 px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold rounded-full transition-all duration-300"
            >
              Join Now
            </NavLink>
          </div>
        </section>
      </div>

    </>
  );
}

export default Landing;
