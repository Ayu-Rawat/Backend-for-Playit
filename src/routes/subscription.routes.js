import {Router} from "express"
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();
subscriptionRouter.use(verifyJWT);

subscriptionRouter
    .route("/c/:channelId")
    .get(verifyJWT,getSubscribedChannels)
    .post(verifyJWT,toggleSubscription);

subscriptionRouter.route("/u/:subscriberId").get(verifyJWT,getUserChannelSubscribers);

export default subscriptionRouter