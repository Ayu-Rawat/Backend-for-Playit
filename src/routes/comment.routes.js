import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getCommentDetails,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route("/c/:videoId").get(getVideoComments).post(addComment);
commentRouter.route("/d/:commentId").delete(deleteComment).patch(updateComment).get(getCommentDetails);

export default commentRouter