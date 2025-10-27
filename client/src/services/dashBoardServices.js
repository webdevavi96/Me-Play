import axios from "axios";

const channelVideos = async () => {
    try {
        const res = await axios.get("/api/v1/user/dashboard/channel-videos");
        return res.data.data
    } catch (error) {
        console.error(error)
    }
}

const fetchChannelStatus = async () => {
    try {
        const res = await axios.get("/api/v1/user/dashboard/channel-stats");
        return res.data.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

const fetchLikedVideos = async () => {
   try {
     const res = await axios.get("/api/v1/like/liked/videos");
     return res.data.data
   } catch (error) {
    console.log(error)
    return error
   }
}

export { channelVideos, fetchChannelStatus, fetchLikedVideos }