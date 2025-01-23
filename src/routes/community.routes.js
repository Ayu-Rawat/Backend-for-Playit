import {Router} from "express"
import {
    createCommunity,
    deleteCommunity,
    getUserCommunities,
    updateCommunity,
} from "../controllers/community.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const communityRouter = Router();
communityRouter.use(verifyJWT); 

communityRouter.route("/").post(createCommunity);
communityRouter.route("/user/:userId").get(getUserCommunities);
communityRouter.route("/:tweetId").patch(updateCommunity).delete(deleteCommunity);

export default communityRouter