import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../../components/Cards/VideoCards";
import { fetchAllVideos } from "../../services/videoServices";

function Home() {
  const [videoList, setVideoList] = useState([]);
  const navigate = useNavigate();

  // Fetch all videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const videos = await fetchAllVideos();
        setVideoList(videos.videos || []);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchData();
  }, []);

  // When a user clicks on a video
  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };


  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {videoList.map((video, idx) => (
        <VideoCard key={idx} video={video} onVideoClick={handleVideoClick} />
      ))}
    </div>
  );
}

export default Home;
