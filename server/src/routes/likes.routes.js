import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { getAllLikedVideos, toggleLikeVideo } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle-like/:videoId").post(
    verifyJWT,
    toggleLikeVideo
);
router.route("/all-liked-videos").get(
    verifyJWT,
    getAllLikedVideos
);

export default router;