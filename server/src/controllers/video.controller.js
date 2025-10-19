import mongoose, { isValidObjectId, mongo } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"
import deleteItem from "../utils/deleteItem.js"


const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos based on query, sort, pagination
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    if (!userId) throw new ApiError(400, "User id is missing");
    const skip = (page - 1) * limit;
    const videos = await Video.aggregate([
        {
            $match: { user: new mongoose.Types.ObjectId(userId) }
        },
        {
            $sort: { [sortBy]: sortType === "asc" ? 1 : -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ]);

    const totalCountAgr = await Video.countDocuments({
        $match: { user: new mongoose.Types.ObjectId(userId) }
    });

    const totalCount = Math.ceil(totalCountAgr / limit)

    const data = {
        videos,
        totalCount
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Videos fetched successfully"));

});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body
    if (!(title || description)) throw new ApiError(400, "All fields are required");

    const videoLocalPath = req.files?.video[0]?.path;
    if (!videoLocalPath) throw new ApiError(400, "Something went wrong while uploading video.");

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file field is required");

    const thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    const videoFile = await uploadToCloudinary(videoLocalPath);
    if (!thumbnail) throw new ApiError(500, "Error while uploading thumbnail on cloud");
    if (!videoFile) throw new ApiError(500, "Error while uploading video on cloud");
    const video = await Video.create({
        title,
        description,
        thumbnail: thumbnail || null,
        duration: videoFile.duration,
        videoFile: videoFile.url,
        publisher: req.user?._id,
        isPublished: true
    });

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));

});

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id
    const { videoId } = req.params;
    const validId = isValidObjectId(videoId);
    if (!validId) throw new ApiError(400, "Invalid Video Id");
    const video = await Video.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(videoId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "publisher",
                as: "publisher",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                            _id: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                publisher: { $first: "$publisher" }
            }
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                videoFile: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                publisher: 1
            }
        }

    ]);

    if (!video.length) throw new ApiError(404, "Video not found");

    return res
        .status(200)
        .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
    const { videoId } = req.params;
    const { title, description } = req.body;

    const validId = isValidObjectId(videoId);
    if (!validId) throw new ApiError(400, "Invalid Video Id");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    if (req.user._id !== video.publisher) throw new ApiError(403, "You can not perform this operation");

    let updateData = {};

    const videoLocalPath = req.files?.video[0].path;
    const thumbnailLocalPath = req.files?.thumbnail[0].path;
    if (!videoLocalPath) throw new ApiError(400, "Video file field is required");
    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail file field is required");

    const thumbnail = await uploadToCloudinary(thumbnailLocalPath);
    const videoFile = await uploadToCloudinary(videoLocalPath);

    if (!thumbnail) throw new ApiError(500, "Error while uploading thumbnail");
    if (!videoFile) throw new ApiError(500, "Error while uploding video");

    if (description) updateData.description = description;
    if (title) updateData.title = title;
    updateData.videoFile = videoFile.url;
    updateData.thumbnail = thumbnail.url;
    updateData.duration = videoFile.duration || video.duration;

    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        { $set: updateData },
        { new: true });


    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo[0], "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params;
    const validVideoId = isValidObjectId(videoId);
    if (!validVideoId) throw new ApiError(400, "Video id is not valid");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");
    if (req.user._id.toString() !== video.publisher.toString()) throw new ApiError(403, "You can not perform this operation");

    const videoUrl = video.videoFile;
    const thumbnailUrl = video.thumbnail;

    if (!videoUrl) throw new ApiError(404, "Video not found");
    if (!thumbnailUrl) throw new ApiError(404, "Thumbnail not found");

    const videoDeleteRes = await deleteItem(videoUrl, type = "video");
    const thumbnailDeleteRes = await deleteItem(thumbnailUrl, type = "image")
    await video.deleteOne();

    const isVideoDeleted = videoDeleteRes?.result === "ok" || videoDeleteRes?.result === "not found";
    const isThumbDeleted = thumbnailDeleteRes?.result === "ok" || thumbnailDeleteRes?.result === "not found";

    if (!(isVideoDeleted || isThumbDeleted)) throw new ApiError(500, "Error while deleting resource")

    return res
        .status(200)
        .json(new ApiResponse(200, "Video deleted successfully"));

});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const validVideoId = isValidObjectId(videoId);
    if (!validVideoId) throw new ApiError(400, "Video Id is invalid");

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video Not Found");

    video.isPublished = !video.isPublished;
    await video.save();

    const videoPublishStatus = { status: video.isPublished };

    return res
        .status(200)
        .json(new ApiResponse(200, videoPublishStatus[0], "Video status changed successfully"));

});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}