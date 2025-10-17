import {
    chnageCurrentPassword,
    LogInUser,
    logOutUser,
    refreshAccessToken,
    registerUser,
    updateUserAvatar,
    updateAccountDetails,
    updateUsercoverImage,
    getCurrentUser,
    chnageCurrentPassword,
    getUserChannelList,
    getWatchHistory
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(
    // Injecting middlewere to handel files
    upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),

    // Calling the controller
    registerUser
);

router.route("/login").post(LogInUser);

// Secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/get-watch-hostory").get(verifyJWT, getWatchHistory);
router.route("/update-account").post(verifyJWT, updateAccountDetails);
router.route("/change-password").post(verifyJWT, chnageCurrentPassword);
router.route("/get-channel/:username").get(verifyJWT, getUserChannelList);
router.route("/update-avatar-image").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUsercoverImage);


export default router;