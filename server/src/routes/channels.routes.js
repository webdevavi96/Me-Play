import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/toggle-subscribe/:channelId").post(
    verifyJWT,
    toggleSubscription
);
router.route("/subscribers-list/:channelId").post(
    verifyJWT,
    getUserChannelSubscribers
);
router.route("/subscribed-channels/:subscriberId").post(
    verifyJWT,
    getSubscribedChannels
);

export default router;