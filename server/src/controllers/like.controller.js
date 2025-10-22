import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleLikeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!(isValidObjectId(videoId))) throw new ApiError(401, "Invalid video id");

    const userId = req.user._id;
    if (!(isValidObjectId(userId))) throw new ApiError(400, "Unauthirized access");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    const likedAlready = await Like.findOne({
        likedTo: videoId,
        likedBy: userId
    });
    if (likedAlready) {
        await Like.findByIdAndDelete(likedAlready._id);
        return res
            .status(200)
            .json(new ApiResponse(200, "Video unliked successfully"));
    };

    await Like.create({
        likedTo: videoId,
        likedBy: userId
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Video liked successfully"));

});

const getAllLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    if (!isValidObjectId(userId)) throw new ApiError(401, "Unauthorized access");

    const likedVideos = await Like.aggregate([
        { $match: { likedBy: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "videos",
                localField: "likedTo",
                foreignField: "_id",
                as: "videoData"
            }
        },
        { $unwind: "$videoData" },
        {
            $lookup: {
                from: "users",
                localField: "videoData.publisher",
                foreignField: "_id",
                as: "publisher"
            }
        },
        { $unwind: "$publisher" },
        {
            $project: {
                _id: 0,
                videoId: "$videoData._id",
                title: "$videoData.title",
                videoUrl: "$videoData.videoFile",
                thumbnail: "$videoData.thumbnail",
                username: "$publisher.username",
                fullName: "$publisher.fullName",
                avatar: "$publisher.avatar"
            }
        }
    ]);

    if (!likedVideos.length)
        throw new ApiError(404, "User hasn't liked any videos yet");

    const data = {
        videos: likedVideos,
        totalLiked: likedVideos.length
    };

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Liked videos fetched successfully"));
});




export { toggleLikeVideo, getAllLikedVideos };