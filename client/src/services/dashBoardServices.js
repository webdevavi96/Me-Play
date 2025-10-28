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
};


const fetchSubscribers = async (channelId) => {
    try {
        const res = await axios.get(`/api/v1/channels/subscribers-list/${channelId}`);
        return res.data.data;
    } catch (error) {
        console.log(error)
        return error
    }
};

const fetchSubscribedChannels = async (subscriberId) => {
    try {
        const res = await axios.get(`/api/v1/channels/subscribed-channels/${subscriberId}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        throw error;
    }
};

const unSubscribe = async (channelId) => {
    const res = await axios.get(`api/v1/channels/unsubscribe/channel/${channelId}`)
    return res.data
}

export { channelVideos, fetchChannelStatus, fetchLikedVideos, fetchSubscribers, fetchSubscribedChannels, unSubscribe }