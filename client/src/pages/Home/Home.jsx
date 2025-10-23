import React from "react";

// Sample data for videos
const videos = [
  {
    id: 1,
    title: "Learn React in 10 Minutes",
    channel: "Code Academy",
    views: "1.2M views",
    date: "1 week ago",
    thumbnail: "/images/video1.jpg",
    avatar: "/images/channel1.jpg",
  },
  {
    id: 2,
    title: "Top 10 JavaScript Tricks",
    channel: "Tech Guru",
    views: "850K views",
    date: "3 days ago",
    thumbnail: "/images/video2.jpg",
    avatar: "/images/channel2.jpg",
  },
  // add more sample videos
];

function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
     

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Navbar */}
       
        {/* Video grid */}
        <main className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition">
              <img src={video.thumbnail} alt={video.title} className="w-full h-48 rounded-t-lg object-cover" />
              <div className="flex p-3">
                <img
                  src={video.avatar}
                  alt={video.channel}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold">{video.title}</h3>
                  <p className="text-gray-500 text-sm">{video.channel}</p>
                  <p className="text-gray-400 text-xs">{video.views} • {video.date}</p>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default Home;
