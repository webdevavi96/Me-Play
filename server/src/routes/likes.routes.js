import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getAllLikedVideos, toggleLikeVideo } from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle-like").post(
    verifyJWT,
    toggleLikeVideo
);
router.route("/all-liked-videos").post(
    verifyJWT,
    getAllLikedVideos
);

export default router;