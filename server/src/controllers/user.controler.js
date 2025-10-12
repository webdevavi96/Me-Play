import asyncHandler from "../utils/asyncHandeler.js";

const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "It's working well.."
    })
});

export { registerUser }