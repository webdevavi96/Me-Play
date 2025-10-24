import React from "react";

function Card(props) {
  return (
    <div className="max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] duration-300">
      {/* Video */}
      <div className="relative">
        <video
          className="w-full aspect-video object-cover"
          src={videoSrc}
          controls
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 line-clamp-2">
          {title || "Video Title"}
        </h2>

        {/* Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition">
              👍 Like
            </button>
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition">
              💬 Comment
            </button>
            <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition">
              🔗 Share
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="flex justify-between items-center border-t pt-3">
          <div className="flex items-center gap-2">
            <img
              src={userAvatar || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {username || "Username"}
            </span>
          </div>
          <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
