import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Generating Access and Refresh tokens ->
const generateAccesssAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessTokenn();
        const refreshToken = user.generateRefreshTokenn();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Internal server error! Please try again later.");
    }
}

// Register methode definition ->
const registerUser = asyncHandler(async (req, res) => {
    // get user details from front end
    // validaton - not empty
    // check if user already exists: images, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const { fullName, username, email, password } = req.body

    // Validating user data
    if ([fullName, username, email, password].some((field) => field?.trim() === "")) throw new ApiError(400, "All fields are required!");

    // Checking user is exist or not
    const existingUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    });

    // Throwing a new error to client
    if (existingUser) throw new ApiError(409, "User with username and email already exists");

    // storing the refrence path of the files 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) coverImageLocalPath = req.files.coverImage[0].path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar Image is required!");


    // Uploading the files on cloudinary.
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) throw new ApiError(400, "Avatar Image is required!");

    // Creating user in database
    const user = await User.create({
        fullName, email, password, avatar: avatar.url, username: username.toLowerCase(), coverImage: coverImage?.url || "",
    });

    // checking if the user created or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) throw new ApiError(500, "Something went wrong while registring the user!");

    // Returning response to front end..
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    );

});


// Login methode definition -
const LogInUser = asyncHandler(async (req, res) => {
    // get user details from front end.
    // username or email.
    // Validate whether the details or not empty.
    // Verify the details that user exists or not.
    // Check for password is correct or not.
    // access token and refresh token.
    // send cookie.

    const { username, email, password } = req.body;

    if (!(username || email)) throw new ApiError(400, "username or password is required!");

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) throw new ApiError(404, "User does not exist!");

    const isPassword = await user.isPasswordCorrect(password);
    if (!isPassword) throw new ApiError(401, "Incorrect password!");

    const { accessToken, refreshToken } = await generateAccesssAndRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: user, accessToken, refreshToken
            },
                "Log in successfull"
            )
        )

});


// Log out user ->
const logOutUser = asyncHandler(async (req, res) => {
    User.findOneAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", options)
        .cookie("refreshToken", options)
        .json(new ApiResponse(200, "Log out successfull!"))

});


// Refresh access token ->
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incommingRefreshToken) throw new ApiError(401, "Unauthorized request!F");

    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if (!user) throw new ApiError(401, "Invalid refresh token!");

        if (incommingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");

        const options = {
            httpOnly: true,
            secure: true
        };

        const { accessToken, newRefreshToken } = await generateAccesssAndRefreshToken(user?._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(new ApiResponse(200, { accessToken, newRefreshToken }, "Access token refreshed"));

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});


// Change password->
const chnageCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

    user.password = newPassword
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));

});


// getting current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});


// Text data updating
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!(fullName || email)) throw new ApiError(400, "All fields are required");
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { fullName, email }
        }, { new: true }).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"));

});

// Avatar updating
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar image file is required");

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar) throw new ApiError(400, "Error while uploading avatar image");

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: { avatar: avatar.url }
    }, { new: true }).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "Avatar image updated successfully"));
});


// Image data updating
const updateUsercoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) throw new ApiError(400, "cover image file is required");

    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    if (!coverImage) throw new ApiError(400, "Error while uploading cover image");

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: { coverImage: coverImage.url }
    }, { new: true }).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "cover image updated successfully"));
});


// Aggregation pipline to get channel list subscribed by user
const getUserChannelList = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) throw new ApiError(400, "username is missing");

    const channel = await User.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "Subscription",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscriber" },
                channelsSubscribedToCount: { $size: "subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: true
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                isSubscribed: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
            }
        }
    ]);

    if (!channel?.length) throw new ApiError(404, "Channel does not exists");
    return res
        .status(200)
        .json(new ApiResponse(200, channel[0], "User channel fetched successfully")); fffffff

});


// Pipelines for watch history
const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, user[0].watchHistory, "Watch histroy fetched successfully"));

});


export {
    registerUser,
    LogInUser,
    logOutUser,
    refreshAccessToken,
    chnageCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelList,
    getWatchHistory
}