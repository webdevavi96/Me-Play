import { Router } from "express";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/add-comment").post(
    verifyJWT,
    addComment
);
router.route("/update-comment").post(
    verifyJWT,
    updateComment
);
router.route("/delet-comment").get(
    verifyJWT,
    deleteComment
);
router.route("/all-comments").get(
    verifyJWT,
    getVideoComments
);


export default router;