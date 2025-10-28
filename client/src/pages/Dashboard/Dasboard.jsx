import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";
import capitalizeName from "../../utils/capitaliseName";
import {
  channelVideos,
  fetchChannelStatus,
  fetchLikedVideos,
  fetchSubscribers,
} from "../../services/dashBoardServices";
import axios from "axios";
import { Loader } from "../../components/components";
import { FaUser } from "react-icons/fa";
import Back from "../../components/Buttons/Back";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("history");
  const [watchHistory, setWatchHistory] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [uploadsCount, setUploadsCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [subscribed, setSubscribed] = useState(0);
  const [likedVideos, setLikedVideos] = useState([]);
  const [likedVideosCount, setLikedVideosCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await channelVideos();
        setUploads(res || []);

        const channelStats = await fetchChannelStatus();
        setUploadsCount(channelStats.totalVideos || 0);
        setSubscribed(channelStats.subscribedChannelsCount || 0);

        const historyRes = await axios.get("/api/v1/users/history");
        setWatchHistory(historyRes.data?.data || []);

        const likedRes = await fetchLikedVideos();
        setLikedVideos(likedRes?.videos || []);
        setLikedVideosCount(likedRes?.totalLiked || 0);

        if (user?._id) {
          const subsRes = await fetchSubscribers(user._id);
          setSubscribersCount(subsRes?.subscriberCount || 0);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);


  const handleVideoClick = (videoId) => navigate(`/watch/${videoId}`);

  if (loading) return <Loader />;

  return (
    <div className="max-w-[1200px] mx-auto p-4 space-y-6 text-white">
      {/* ---------- USER PROFILE ---------- */}
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <Back />
        <div className="h-40 bg-gray-800">
          {user?.banner && (
            <img
              src={user.banner}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-gray-900 object-cover -mt-12 md:mt-0"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-gray-900 bg-gray-800 -mt-12 md:mt-0">
              <FaUser className="text-gray-400 text-3xl" />
            </div>
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {capitalizeName(user?.fullName) || "Unknown User"}
            </h2>
            <p className="text-gray-300">@{user?.username || "username"}</p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-white font-semibold">{subscribersCount}</p>
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

      {/* ---------- TABS ---------- */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-lg space-y-4">
        <div className="flex gap-4 border-b border-gray-700">
          {["history", "uploads", "liked"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${activeSection === tab
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-400"
                }`}
              onClick={() => setActiveSection(tab)}
            >
              {tab === "history"
                ? `Watch History (${watchHistory.length})`
                : tab === "uploads"
                  ? `Uploads (${uploadsCount})`
                  : `Liked Videos (${likedVideosCount})`}
            </button>
          ))}
        </div>

        {/* ---------- SECTIONS ---------- */}
        {activeSection === "history" && (
          <VideoGrid
            title="Watch History"
            videos={watchHistory}
            onClick={handleVideoClick}
          />
        )}

        {activeSection === "uploads" && (
          <>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">
                Total Uploads: {uploadsCount}
              </h3>
              <button
                onClick={() => navigate("/settings/videos")}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
              >
                Manage Videos
              </button>
            </div>
            <VideoGrid videos={uploads} onClick={handleVideoClick} />
          </>
        )}

        {activeSection === "liked" && (
          <VideoGrid
            title={`Liked Videos (${likedVideosCount})`}
            videos={likedVideos}
            onClick={handleVideoClick}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// ✅ Reusable grid
function VideoGrid({ title, videos, onClick }) {
  return (
    <div className="space-y-4 mt-4">
      {title && <h3 className="text-white font-semibold">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div
              key={video._id || video.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => onClick(video._id || video.id)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 object-cover"
              />
              <p className="text-white p-2 text-sm truncate">{video.title}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-10">
            No videos found.
          </div>
        )}
      </div>
    </div>
  );
}
