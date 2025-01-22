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

communityRouter.route("/").post(verifyJWT,createCommunity);
communityRouter.route("/user/:userId").get(verifyJWT,getUserCommunities);
communityRouter.route("/:tweetId").patch(verifyJWT,updateCommunity).delete(verifyJWT,deleteCommunity);

export default communityRouter