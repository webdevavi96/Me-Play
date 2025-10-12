import { registerUser } from "../controllers/user.controler.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    // Injecting middlewere to handel files
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),

    // Calling the controller
    registerUser
);


export default router;