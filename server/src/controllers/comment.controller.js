import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;
    if (!userId) throw new ApiError(404, "unAuthorised access");

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const allComments = await Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                "ownerDetails._id": 1,
                "ownerDetails.username": 1,
                "ownerDetails.fullName": 1,
                "ownerDetails.avatar": 1
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (pageNum - 1) * limitNum },
        { $limit: limitNum }
    ]);

    const totalComments = await Comment.countDocuments({ video: videoId });

    if (!totalComments) {
        return res
            .status(200)
            .json(new ApiResponse(200, "No comments made yet"));
    };

    const data = {
        totalComments: totalComments,
        page: pageNum,
        limit: limitNum,
        comments: allComments
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { content, videoId } = req.body;
    if (!(content && videoId)) throw new ApiError(401, "All fields are required");
    if (!(isValidObjectId(videoId))) throw new ApiError(400, "Invalid video id");

    const userId = req.user._id;
    if (!userId) throw new ApiError(400, "Unauthorised access");
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    await Comment.create({
        content: content,
        video: videoId,
        owner: userId
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment added successfully"));

});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(commentId))
        throw new ApiError(400, "Invalid comment id");

    if (!content?.trim())
        throw new ApiError(400, "Content is required to update comment");

    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // Only owner can edit their comment
    if (comment.owner.toString() !== userId.toString())
        throw new ApiError(403, "You are not authorized to update this comment");

    comment.content = content;
    await comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId))
        throw new ApiError(400, "Invalid comment id");

    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    // Only owner can delete their comment
    if (comment.owner.toString() !== userId.toString())
        throw new ApiError(403, "You are not authorized to delete this comment");

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, "Comment deleted successfully"));
});


export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}