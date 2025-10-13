import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

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

    // Checking is exist or not
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

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) coverImageLocalPath = req.files.coverImage.path;

 
    if (!avatarLocalPath) throw new ApiError(400, "Avatar Image is required!");


    // Uploading the files on cloudinary.
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    if (!avatar) throw new ApiError(400, "Avatar Image is required!");

    // Creating user in database
    const user = await User.create({
        fullName,
        email,
        password,
        avatar: avatar.url,
        username: username.toLowerCase(),
        coverImage: coverImage?.url || "",

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

export { registerUser }