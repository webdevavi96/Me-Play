import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/toggle-subscription/:channelId").get(
    verifyJWT,
    toggleSubscription
);
router.route("/subscribers-list/:channelId").get(
    verifyJWT,
    getUserChannelSubscribers
);
router.route("/subscribed-channels/:channelId").get(
    verifyJWT,
    getSubscribedChannels
);

export default router;