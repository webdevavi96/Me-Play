import { addToWatchHistory, deleteVideo, getAllUsersVideos, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";


const router = Router();

router.route("/upload-video").post(
    verifyJWT,
    upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]),
    publishAVideo
);
router.route("/all-videos").get(
    verifyJWT,
    getAllVideos
);
router.route("/video/:videoId").get(
    verifyJWT,
    getVideoById
);
router.route("/update-video/:videoId").post(
    verifyJWT,
    upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "videoFile", maxCount: 1 }]),
    updateVideo
);
router.route("/watched/:videoId").post(
    verifyJWT,
    addToWatchHistory
)
router.route("/video-status/:videoId").get(
    verifyJWT,
    togglePublishStatus
);
router.route("/delete/:videoId").get(
    verifyJWT,
    deleteVideo
);
router.route("/videos").get(
    verifyJWT,
    getAllUsersVideos
);

export default router;