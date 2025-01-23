import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const user = req.user?._id;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Bad Request", "Invalid video id")
    }

    const existingLike = await Like.findOne({
        likeBy: user,
        video: videoId
    })

    if (existingLike) {
        await Like.findOneAndDelete({
            likeBy: user,
            video: videoId,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, "like removed from video"))
    } else {
        const like = await Like.create({
            likeBy: user,
            video: videoId,
        })

        return res
            .status(200)
            .json(new ApiResponse(200, like, "like is added to video"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Bad Request", "Invalid comment id")
    }

    const existingLike = await Like.findOne({
        likeBy: userId,
        comment: commentId
    })

    if (existingLike){
        await Like.findByIdAndDelete(existingLike._id)

        return res
            .status(200)
            .json(
                new ApiResponse(200,"Like removed from comment")
            )
    }else{
        const like = await Like.create({
            likeBy: userId,
            comment: commentId,
        })

        return res
            .status(200)
            .json(
                new ApiResponse(200, like, "Like is added to comment")
            )
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Bad Request", "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likeBy: userId,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json({
            success: true,
            message: "Tweet unliked successfully",
        });
    } else {
        const newLike = new Like({
            tweet: tweetId,
            likeBy: userId,
        });

        await newLike.save();

        return res.status(200).json({
            success: true,
            message: "Tweet liked successfully",
        });
    }
});


const getLikedVideos = asyncHandler(async (req, res) => {
    // Step 1: Ensure user ID exists
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    // Step 2: Aggregate and filter likes
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likeBy: mongoose.Types.ObjectId(userId),
                video: { $exists: true, $ne: null }, // Ensure only likes for videos
            },
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails",
            },
        }
    ]);

    if (likedVideos.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No videos liked by you"));
    }

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}