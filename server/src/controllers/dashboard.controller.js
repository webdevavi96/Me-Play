import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id;
    if (!userId) throw new ApiError(400, "Incorrect userId");

    const videos = await Video.find({ publisher: userId });
    const totalVideos = videos.length;

    const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
    const totalLikes = videos.reduce((acc, video) => acc + (video.likes || 0), 0);

    const subscribedChannels = await Subscription.find({ subscriber: userId });
    const subscribedChannelsCount = subscribedChannels.length;

    const likes = await Like.find({ user: userId });
    const likesByUser = likes.length;

    const comments = await Comment.find({owner: userId})
    const commentsCount = comments.length;


    const data = {
        totalVideos,
        totalViews,
        totalLikes,
        subscribedChannelsCount,
        likesByUser,
        commentsCount,
        comments
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "User data fetched successfully"));

});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;
    if (!userId) throw new ApiError(404, "Unauthorised access");

    const videos = await Video.find({ publisher: userId });
    if (!videos) throw new ApiError(400, "User haven't posted anything yet");

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetcthed successfully"));
})

export {
    getChannelStats,
    getChannelVideos
}