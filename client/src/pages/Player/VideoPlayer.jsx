import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { postComment, likeVideo } from "../../services/videoServices";
import capitalizeName from "../../utils/capitaliseName";
import { FaThumbsUp, FaRegThumbsUp, FaShareAlt, FaCommentAlt } from "react-icons/fa";
import { AuthContext } from "../../utils/authContext"

function VideoPlayer() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/v1/videos/video/${id}`);
        setVideo(res.data.data);
        setLikes(res.data.data.likes || 0);

        const related = await axios.get(`/api/v1/videos`);
        setRelatedVideos(related.data.data || []);
      } catch (err) {
        console.error("Failed to fetch video", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      const status = await likeVideo(id);
      if (status === 200 || status === "success") {
        if (liked) {
          setLikes((prev) => prev - 1);
          setLiked(false);
        } else {
          setLikes((prev) => prev + 1);
          setLiked(true);
        }
      } else {
        console.error("Failed to like video", status);
      }
    } catch (err) {
      alert("Failed to like video");
    }
  };



  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Video link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const status = await postComment(commentText, id);
      console.log(status)
      console.log(user)
      if (status == 200 || status == "success") {
        const newComment = {
          id: Date.now(),
          text: commentText,
          user: capitalizeName(user?.fullName),
          createdAt: new Date().toISOString(),
        };

        setComments([newComment, ...comments]);
        setCommentText("");
      } else {
        console.error(status)
        alert("Unable to post comment")
      }
    } catch (error) {
      console.error(error)
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading video...</p>;

  if (!video)
    return <p className="text-center text-gray-500 mt-10">Video not found</p>;

  const { videoFile, title, publisher, views, createdAt, description } = video;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 p-4 bg-linear-to-br from-gray-900 via-black to-gray-950 min-h-screen">
      {/* ---------- LEFT: Main Video Section ---------- */}
      <div className="flex-1 lg:w-[65%]">
        {/* Video Player */}
        <div className="bg-black rounded-xl overflow-hidden shadow-lg">
          <video
            className="w-full aspect-video object-cover"
            src={videoFile}
            controls
            autoPlay
          />
        </div>

        {/* Video Title */}
        <h1 className="text-2xl font-semibold mt-3 text-white">{title}</h1>

        {/* Channel Info + Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4 mt-3 gap-3">
          <div className="flex items-center gap-3">
            <img
              src={publisher?.avatar || "/images/default-avatar.jpg"}
              alt="Channel Avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <h2 className="font-medium text-gray-200 capitalize">
                {publisher?.fullName || "Uploader"}
              </h2>
              <p className="text-sm text-gray-400">
                {views || 0} views • {formatDate(createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              {liked ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              <FaShareAlt /> Share
            </button>

            {/* Subscribe Button */}
            <button className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full text-sm transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-900 border border-gray-800 p-4 rounded-xl text-white">
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {description || "No description available."}
          </p>
        </div>

        {/* ---------- COMMENTS SECTION ---------- */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">
            Comments ({comments.length})
          </h3>

          <form
            onSubmit={handleCommentSubmit}
            className="flex gap-3 mb-4 items-center"
          >
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring focus:ring-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition"
            >
              Post
            </button>
          </form>

          <div className="space-y-3">
            {comments.length > 0 ? (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-800 p-3 rounded-lg text-gray-200"
                >
                  <p className="font-semibold">{c.user}</p>
                  <p className="text-sm">{c.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(c.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No comments yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- RIGHT: Related Videos ---------- */}
      <div className="lg:w-[30%] w-full h-fit lg:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">
          Related Videos
        </h3>

        {relatedVideos.length > 0 ? (
          relatedVideos
            .filter((vid) => vid._id !== id)
            .slice(0, 10)
            .map((vid) => (
              <div
                key={vid._id}
                className="flex gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition"
                onClick={() => navigate(`/player/${vid._id}`)}
              >
                <img
                  src={vid.thumbnail || "/images/default-thumbnail.jpg"}
                  alt={vid.title}
                  className="w-40 h-24 rounded-lg object-cover"
                />
                <div className="flex flex-col justify-center w-[60%]">
                  <p className="font-medium text-gray-100 text-sm line-clamp-2">
                    {vid.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {vid.publisher?.fullName || "Uploader"}
                  </p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-sm">No related videos found</p>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;
