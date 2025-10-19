import { Subscription } from "../models/subscription.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose, { isValidObjectId } from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const { channelId } = req.params;
    if (!(isValidObjectId(channelId))) throw new ApiError(400, "Invalid channel id");

    const user = await User.findById(req.user._id);
    const channel = await User.findById(channelId);
    if (!user) throw new ApiError(404, "User not found");
    if (!channel) throw new ApiError(404, "Channel not found");

    const isSubscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channel
    });

    if (isSubscribed) {
        await Subscription.findByIdAndDelet(isSubscribed._id);
        return res
            .status(200)
            .json(new ApiResponse(200, "Channel unsubscribed successfully"))
    } else {
        const subscribed = await Subscription.create({
            subscriber: req.user._id,
            channel: channel
        });
        if (!subscribed) throw new ApiError(500, "Error while subscribing channel");
        return res
            .status(201)
            .json(new ApiResponse(201, subscribed, "Channel subscribed successfully"));
    };
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
        {
            $unwind: "$channelDetails"
        },
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

    if (!channels.length) throw new ApiError(400, "User does not subscribed any channel yet");
    const subscribedChannelsCount = channels.length;
    const isSelf = channels.some((sub) => sub.channelId.toString() === req.user?._id);

    const data = {
        channels,
        subscribedChannelsCount,
        isSelf
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Subscribed channels fetched successfully"));

});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}