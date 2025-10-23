import React from "react";

function Loader() {
  return (
    <div className="h-screen w-full bg-black flex flex-col justify-center items-center">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-red-500 border-t-white rounded-full animate-spin"></div>

      {/* Logo Text */}
      <p className="text-2xl mt-6 font-extrabold text-red-500">
        M<span className="text-white">Play</span>
      </p>

      {/* Optional Loading Text */}
      <p className="text-white mt-2 text-lg font-medium animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export default Loader;
