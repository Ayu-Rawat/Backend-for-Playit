import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const commentRouter = Router();

commentRouter.use(verifyJWT);

commentRouter.route("/c/:videoId").get(verifyJWT,getVideoComments).post(verifyJWT,addComment);
commentRouter.route("/c/:commentId").delete(verifyJWT,deleteComment).patch(verifyJWT,updateComment);

export default commentRouter