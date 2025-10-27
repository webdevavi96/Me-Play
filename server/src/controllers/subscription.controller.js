import { Subscription } from "../models/subscription.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"

// Controller to toggle subscription
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel id");


    if (req.user._id.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    // Find channel
    const channel = await User.findById(channelId);
    if (!channel) throw new ApiError(404, "Channel not found");

    // Check if already subscribed
    const isSubscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channel._id
    });

    if (isSubscribed) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(isSubscribed._id);
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Channel unsubscribed successfully"));
    } else {
        // Subscribe
        const subscribed = await Subscription.create({
            subscriber: req.user._id,
            channel: channel._id
        });
        if (!subscribed) throw new ApiError(500, "Error while subscribing channel");
        return res
            .status(200)
            .json(new ApiResponse(200, subscribed, "Channel subscribed successfully"));
    }
});


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!(isValidObjectId(channelId))) throw new ApiError(400, "Invalid channel id");

    const subscribersList = await Subscription.aggregate([
        {
            $match: { channel: new mongoose.Types.ObjectId(channelId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },
        {
            $unwind: "$subscriberDetails"
        },
        {
            $project: {
                _id: 0,
                subscriberId: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                fullName: "$subscriberDetails.fullName",
                avatar: "$subscriberDetails.avatar",
                coverImage: "$subscriberDetails.coverImage"
            }
        }
    ]);

    if (!subscribersList.length) throw new ApiError(404, "This channel has no subscribers yet");
    const subscriberCount = subscribersList.length;
    const isSubscribed = subscribersList.some((subs) => subs.subscriberId.toString() === req.user?._id.toString());

    const data = {
        subscribersList,
        subscriberCount,
        isSubscribed
    };

    return res
        .status(200)
        .json(new ApiResponse(200, data, "All subscribers fetched succesfully"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!(isValidObjectId(subscriberId))) throw new ApiError(400, "Invalid subscriber Id");

    const channels = await Subscription.aggregate([
        {
            $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },
        { $unwind: "$channelDetails" },
        {
            $project: {
                _id: 0,
                channelId: "$channelDetails._id",
                username: "$channelDetails.username",
                fullName: "$channelDetails.fullName",
                avatar: "$channelDetails.avatar",
                coverImage: "$channelDetails.coverImage"
            }
        }
    ]);

    if (!channels.length) throw new ApiError(404, "User has not subscribed to any channels yet");

    const subscribedChannelsCount = channels.length;

    const isSelf = channels.some(
        (sub) => sub.channelId.toString() === req.user?._id.toString()
    );

    const data = {
        channels: channels[0],
        subscribedChannelsCount,
        isSelf
    };

    return res.status(200).json(
        new ApiResponse(200, data, "Subscribed channels fetched successfully")
    );
});



const isSubscribed = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { channelId } = req.params;

    if (!channelId) {
        return res.status(400).json({ message: "Channel ID is required" });
    }

    const result = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $group: {
                _id: "$channel",
                subscribers: { $push: "$subscriber" },
            },
        },
        {
            $addFields: {
                isSubscribed: {
                    $in: [new mongoose.Types.ObjectId(userId), "$subscribers"],
                },
            },
        },
        {
            $project: {
                _id: 0,
                isSubscribed: 1,
            },
        },
    ]);

    const isSubscribed =
        result.length > 0 ? result[0].isSubscribed : false;

    res.status(200).json({
        success: true,
        isSubscribed,
    });
});



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    isSubscribed
}