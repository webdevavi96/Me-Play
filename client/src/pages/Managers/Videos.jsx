import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import { channelVideos, fetchChannelStatus } from "../../services/dashBoardServices";
import { deleteVideo } from "../../services/videoServices"
import { Loader } from "../../components/components";
import Back from "../../components/Buttons/Back";

function Videos() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [uploads, setUploads] = useState([]);
    const [uploadsCount, setUploadsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await channelVideos();
                setUploads(res || []);
                const channelStats = await fetchChannelStatus();
                setUploadsCount(channelStats.totalVideos || 0);
            } catch (error) {
                console.error("Error fetching videos: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchVideos();
    }, [user]);


    const handleWatch = (videoId) => {
        navigate(`/watch/${videoId}`);
    };

    const handleEdit = (videoId) => {
        alert(`Edit functionality for video ${videoId} coming soon!`);
    };

    const handleDelete = async (video) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                const videoId = video._id
                const res = await deleteVideo(videoId)
                if (res.status == 200 || res.status == "success") {
                    alert(`Deleted video ${video.title}`);
                } else {
                    alert("something went wrong!")
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh] text-gray-400">
                <Loader />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-xl shadow-lg">
            {/* ---------- HEADER ---------- */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                <h1 className="text-2xl font-bold">Manage Videos</h1>
                <Back />
            </div>

            {/* ---------- STATS ---------- */}
            <p className="text-gray-400 mb-6">
                Total uploaded videos:{" "}
                <span className="text-white font-semibold">{uploadsCount}</span>
            </p>

            {/* ---------- VIDEO GRID ---------- */}
            {uploads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {uploads.map((video) => (
                        <div
                            key={video._id || video.id}
                            className="bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                        >
                            <div
                                className="cursor-pointer"
                                onClick={() => handleWatch(video._id || video.id)}
                            >
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-3">
                                    <h3 className="font-semibold text-white truncate">{video.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {video.views || 0} views •{" "}
                                        {new Date(video.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center px-3 pb-3">
                                <button
                                    onClick={() => handleEdit(video)}
                                    className="px-3 py-1 bg-blue-600 rounded-md hover:bg-blue-500 transition text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(video)}
                                    className="px-3 py-1 bg-red-600 rounded-md hover:bg-red-500 transition text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                    <p>No videos uploaded yet.</p>
                </div>
            )}
        </div>
    );
}

export default Videos;