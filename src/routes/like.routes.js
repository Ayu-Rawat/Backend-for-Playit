import {Router} from "express"
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const likeRouter = Router();
likeRouter.use(verifyJWT);

likeRouter.route("/toggle/v/:videoId").post(verifyJWT,toggleVideoLike);
likeRouter.route("/toggle/c/:commentId").post(verifyJWT,toggleCommentLike);
likeRouter.route("/toggle/t/:tweetId").post(verifyJWT,toggleTweetLike);
likeRouter.route("/videos").get(verifyJWT,getLikedVideos);

export default likeRouter