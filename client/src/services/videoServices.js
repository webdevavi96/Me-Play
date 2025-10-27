import axios from "axios";

const message = "Something went wront! Please try after sometime";

const fetchVideos = async () => {
    try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?._id;
        const params = {
            userId,
            query: ".*",
            sortBy: "createdAt",
            sortType: "desc",
            page: 1,
            limit: 10
        };
        const response = await axios.get("/api/v1/videos/all-videos", { params });
        const videos = response.data?.data;

        if (!videos || videos.length === 0) {
            return [];
        }

        return videos;
    } catch (error) {
        console.error("Error fetching videos:", error);
        return message

    }
};

const watchVideo = async (videoId) => {
    try {
        const response = await axios.get("/api/v1/videos/video/", { params: videoId });
        const video = response?.data?.video;
        if (!video) return [];
        return video;
    } catch (error) {
        console.log("video not found");
        return message

    }
};

const postComment = async (comment, videoId) => {
    try {
        const res = await axios.post("/api/v1/comments/add-comment", { content: comment, videoId }, { withCredentials: true });
        return res?.status;
    } catch (error) {
        console.error(error)
        return message

    }
}

const fetchComments = async (videoId, page = 1, limit = 10) => {
    try {
        const params = {
            videoId,
            query: ".*",
            page,
            limit,
        };
        const res = await axios.get("/api/v1/comments/all-comments", { params });
        return res?.data?.data;
    } catch (err) {
        console.error("Error fetching comments:", err);
        return message

    }
};

export default fetchComments;


const likeVideo = async (videoId) => {
    try {
        const res = await axios.post(`/api/v1/like/toggle-like/${videoId}`, { withCredentials: true });
        return res.status;
    } catch (error) {
        console.error(error)
        return message
    }
}


const fetchAllVideos = async () => {
    try {
        const params = {
            query: ".*",
            sortBy: "createdAt",
            sortType: "desc",
            page: 1,
            limit: 10
        };
        const response = await axios.get("/api/v1/videos/videos", { params });
        const videos = response.data?.data;
        return videos;
    } catch (error) {
        console.log(error)
        return message
    }
};

const subscribeChannel = async (channelId) => {
    try {
        const res = await axios.post(`/api/v1/channels/subscribe/${channelId}`, {}, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.log(error);
        return message
    }
};

const addToWatchHistory = async (videoId) => {
    try {
        console.log(videoId)
       const res = await axios.post(`/api/v1/videos/watched/${videoId}`);
       console.log(res)
    } catch (err) {
        console.error("Failed to update watch history", err);
    }
};


export { fetchVideos, watchVideo, postComment, likeVideo, fetchComments, fetchAllVideos, subscribeChannel, addToWatchHistory };
