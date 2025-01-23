import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    // Steps to get all video comments
    // take videoId from req.params
    // take queries from req.query
    // use mongoose exists() to check if video exists
    // Now, define mongodb aggregation pipeline
    // Use them in function called with
    // modelName.aggregatePaginate(pipelineDefineAbove, {page, limit})
    // options = {page,limit}
  
    const { videoId } = req.params;
    const { limit = 10 } = req.query;
  
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid video id");
    }
  
    const isVideoExists = await Video.findById(videoId);
  
    if (!isVideoExists) {
      throw new ApiError(404, "video not found");
    }
  
    const options = {
      limit,
    };
  
    const aggregationPipeline = Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  
    const results = await Comment.aggregatePaginate(aggregationPipeline, options);
  
    if (results.totalDocs === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "video has no comments"));
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, results, "comments fetched successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params
    const {content} = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment =await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201,comment,"Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params; // Get the comment ID from the URL
    const { content } = req.body; // Get the updated comment content from the request body

    // Step 1: Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Step 2: Check if the logged-in user is the owner of the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to edit this comment");
    }

    // Step 3: Update the comment content
    comment.content = content;
    await comment.save();

    // Step 4: Return the updated comment
    return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment,
    });
});

const getCommentDetails = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    // Fetch the comment by ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Return the comment details
    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment details given")
    )
});


const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment,
    getCommentDetails
}