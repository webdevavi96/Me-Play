import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  postComment,
  likeVideo,
  fetchComments,
  subscribeChannel,
  addToWatchHistory,
} from "../../services/videoServices";
import capitalizeName from "../../utils/capitaliseName";
import { FaThumbsUp, FaRegThumbsUp, FaShareAlt } from "react-icons/fa";
import { AuthContext } from "../../utils/authContext";
import Back from "../../components/Buttons/Back";

function VideoPlayer() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/videos/video/${id}`);
        const videoData = res.data.data;
        setVideo(videoData);
        setLiked(videoData.isLikedByCurrentUser);
        setLikes(videoData.likesCount);

        const commentData = await fetchComments(id, 1);
        if (commentData) {
          setComments(commentData.comments || []);
          setCommentCount(commentData.totalComments || 0);
          setHasMore(
            commentData.comments?.length >= 10 &&
            commentData.totalComments > commentData.comments.length
          );
        }

        if (videoData?.publisher?._id) {
          const subRes = await axios.get(
            `/api/v1/channels/subscriber/${videoData.publisher._id}`
          );
          setSubscriptionStatus(subRes.data?.isSubscribed || false);
        }

        if (id) addToWatchHistory(id);
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
        setLiked((prev) => !prev);
        setLikes((prev) => prev + (liked ? -1 : 1));
      }
    } catch {
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
      if (status === 200 || status === "success") {
        setCommentText("");
        const updated = await fetchComments(id, 1);
        if (updated) {
          setComments(updated.comments || []);
          setCommentCount(updated.totalComments || 0);
          setHasMore(
            updated.comments?.length >= 10 &&
            updated.totalComments > updated.comments.length
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadMoreComments = async () => {
    if (!hasMore) return;
    try {
      setLoadingComments(true);
      const nextPage = page + 1;
      const commentData = await fetchComments(id, nextPage);
      if (commentData?.comments?.length) {
        setComments((prev) => [...prev, ...commentData.comments]);
        setPage(nextPage);
        setHasMore(
          commentData.totalComments >
          comments.length + commentData.comments.length
        );
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubscription = async () => {
    try {
      const channelId = video?.publisher?._id;
      if (!channelId) return;

      const res = await subscribeChannel(channelId);
      if (res.statusCode === 200 || res.data?.success) {
        setSubscriptionStatus((prev) => !prev);
      }
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading video...</p>;
  if (!video)
    return <p className="text-center text-gray-500 mt-10">Video not found</p>;

  const { videoFile, title, publisher, views, createdAt, description } = video;

  return (
    <div className="max-w-[1400px] mx-auto p-4 bg-linear-to-br from-gray-900 via-black to-gray-950 min-h-screen text-white">
      {/* Back button fixed at top-left */}
      <div className="mb-4">
        <Back />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ---------- LEFT: Main Video Section ---------- */}
        <div className="flex-1 lg:w-[65%]">
          <div className="bg-black rounded-xl overflow-hidden shadow-lg">
            <video
              className="w-full aspect-video object-contain"
              src={videoFile}
              controls
              autoPlay
            />
          </div>

          <h1 className="text-2xl font-semibold mt-3">{title}</h1>

          {/* Channel Info + Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4 mt-3 gap-3">
            <div className="flex items-center gap-3">
              <img
                src={publisher?.avatar || "/images/default-avatar.jpg"}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div>
                <h2 className="font-medium capitalize">
                  {publisher?.fullName || "Uploader"}
                </h2>
                <p className="text-sm text-gray-400">
                  {views || 0} views • {formatDate(createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                {liked ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <FaShareAlt /> Share
              </button>

              <button
                onClick={handleSubscription}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 font-medium rounded-full text-sm transition"
              >
                {subscriptionStatus ? "Subscribed" : "Subscribe"}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4 bg-gray-900 border border-gray-800 p-4 rounded-xl">
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {description || "No description available."}
            </p>
          </div>

          {/* ---------- COMMENTS SECTION ---------- */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">
              Comments ({commentCount})
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
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:ring focus:ring-gray-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition"
              >
                Post
              </button>
            </form>

            <div className="space-y-3">
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex gap-3 bg-gray-800 p-3 rounded-lg"
                  >
                    <img
                      src={c.ownerDetails?.avatar || "/images/default-avatar.jpg"}
                      alt={c.ownerDetails?.fullName || "User"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {capitalizeName(c.ownerDetails?.fullName || "Unknown")}
                      </p>
                      <p className="text-sm">{c.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No comments yet.</p>
              )}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingComments}
                  className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {loadingComments ? "Loading..." : "Load More Comments"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------- RIGHT: Related Videos ---------- */}
        <div className="lg:w-[30%] w-full h-fit lg:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          <h3 className="text-lg font-semibold mb-3">Related Videos</h3>

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
    </div>
  );
}

export default VideoPlayer;
