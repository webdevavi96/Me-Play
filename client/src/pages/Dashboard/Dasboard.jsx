import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import capitliseName from "../../utils/capitaliseName";
import { channelVideos, fetchChannelStatus } from "../../services/dashBoardServices";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("history");
  const [uploads, setUploads] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [subscribers, setSubscribers] = useState(0);
  const [subscribed, setSubscribed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await channelVideos();
        setUploads(res || []);
        
        const channelStats = await fetchChannelStatus()
        setUploadsCount(channelStats.totalVideos || 0);
        setSubscribers(channelStats.subscribersCount || 0);
        setSubscribed(channelStats.subscribedChannelsCount || 0);
        setWatchHistory(channelStats.watchHistory || []);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-6 text-white">
      {/* ---------- USER PROFILE ---------- */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="h-40 bg-gray-800">
          {user?.banner && (
            <img src={user.banner} alt="Banner" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6">
          <img
            src={user?.avatar || "/images/default-avatar.jpg"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover -mt-12 md:mt-0"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{capitliseName(user?.fullName) || "Unknown User"}</h2>
            <p className="text-gray-300">@{user?.username || "username"}</p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-white font-semibold">{subscribers}</p>
                <p className="text-gray-400 text-sm">Subscribers</p>
              </div>
              <div>
                <p className="text-white font-semibold">{subscribed}</p>
                <p className="text-gray-400 text-sm">Subscribed Channels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- WATCH HISTORY / UPLOADS TABS ---------- */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg space-y-4">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-700">
          <button
            className={`px-4 py-2 ${activeSection === "history"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-400"
              }`}
            onClick={() => setActiveSection("history")}
          >
            Watch History
          </button>
          <button
            className={`px-4 py-2 ${activeSection === "uploads"
              ? "border-b-2 border-blue-500 font-semibold"
              : "text-gray-400"
              }`}
            onClick={() => setActiveSection("uploads")}
          >
            Uploads
          </button>
        </div>

        {/* Section Content */}
        {activeSection === "history" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {watchHistory.length > 0 ? (
              watchHistory.map((video) => (
                <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                  <p className="text-white p-2 text-sm">{video.title}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">No watch history yet.</p>
            )}
          </div>
        )}

        {activeSection === "uploads" && (
          <div className="space-y-4 mt-4">
            <h3 className="text-white font-semibold">Total Uploads: {uploadsCount}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploads.length > 0 ? (
                uploads.map((video) => (
                  <div key={video.id} className="bg-gray-800 rounded-lg overflow-hidden shadow">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-32 object-cover" />
                    <p className="text-white p-2 text-sm">{video.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center">No uploads yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
