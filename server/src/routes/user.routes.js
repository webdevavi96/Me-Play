import { chnageCurrentPassword, LogInUser, logOutUser, refreshAccessToken, registerUser, updateUserAvatar, updateAccountDetails, updateUsercoverImage, getCurrentUser, chnageCurrentPassword } from "../controllers/user.controller.js";
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
router.route("get-current-user").post(verifyJWT, getCurrentUser);
router.route("change-password").post(verifyJWT, chnageCurrentPassword);
router.route("update-account").post(verifyJWT, updateAccountDetails);
router.route("update-avatar-image").post(verifyJWT, upload.fields({ name: "avatar", maxCount: 1 }), updateUserAvatar);
router.route("update-cover-image").post(verifyJWT, upload.fields({ name: "coverImage", maxCount: 1 }), updateUsercoverImage);

export default router;