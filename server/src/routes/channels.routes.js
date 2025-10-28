import { getSubscribedChannels, getUserChannelSubscribers, isSubscribed, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.route("/subscribe/:channelId").post(
    verifyJWT,
    toggleSubscription
);
router.route("/subscribers-list/:channelId").get(
    verifyJWT,
    getUserChannelSubscribers
);
router.route("/subscribed-channels/:subscriberId").get(
    verifyJWT,
    getSubscribedChannels
);
router.route("/subscriber/:channelId").get(
    verifyJWT,
    isSubscribed
);
router.route("/unsubscribe/channel/:channelId").get(
    verifyJWT,
    toggleSubscription
)

export default router;