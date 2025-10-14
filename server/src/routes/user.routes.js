import { LogInUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/register").post(
    // Injecting middlewere to handel files
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),

    // Calling the controller
    registerUser
);

router.route("/login").post(LogInUser);

// Secured routes
router.route("/logout").post(verifyJWT, logOutUser);

export default router;