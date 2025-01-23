import mongoose, { isValidObjectId } from "mongoose"
import {Community} from "../models/community.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createCommunity = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body

    const community = await Community.create({
        content,
        owner: req.user._id
    }) 
    
    return res
        .status(201)
        .json(new ApiResponse(201,community,"Community created successfully"))
})

const getUserCommunities = asyncHandler(async (req, res) => {
    // TODO: get user tweets
})

const updateCommunity = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteCommunity = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createCommunity,
    getUserCommunities,
    updateCommunity,
    deleteCommunity
}