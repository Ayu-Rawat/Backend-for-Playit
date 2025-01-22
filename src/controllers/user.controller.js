import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt  from "jsonwebtoken"
import mongoose from "mongoose"

const deleteFile = async (url) => {
    try {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('File deleted:', result);
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

const generateAccessAndRefreshTokens = async(userid) =>{
    try {
        const user = await User.findById(userid)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken =await refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong while genrating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) =>{
    // get user details from frontend done
    // validation -not empty done
    // check if user already exist : username and email done
    // check for avatar and images done
    // upload to cloudinary done
    // create user object - create entry in db done
    // remove password and refresh token field from response done
    // check for user creation done
    // return response or return error done


    const {fullName,email,username,password} = req.body
    console.log("email",email)

    // if (fullName){
    //     throw new ApiError(400,"Full name is required")
    // }
    // and do for each or

    if (
        [fullName,email,username,password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400,"All field are required")
    }

    const existedUser =await User.findOne({
        $or : [{email},{username}]
    })

    if (existedUser){
        throw new ApiError(409,"user with same email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new ApiError(400,"Avatar could not be uploaded")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!isUserCreated){
        throw new ApiError(500,"Something went wrong while registering you")
    }

    return res.status(201).json(
        new ApiResponse(200, isUserCreated, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req,res) =>{
    //req body --> usename or email and password
    //validation
    //find user
    //password check
    //access and refresh token
    //send cookie

    const {username,email,password} = req.body
    if(!(email || username)){
        throw new ApiError(400,"email or username is required")
    }

    //for or if(!(email || username)){
    // code
    //}

    const user = await User.findOne({
        $or:[{email},{username}]
    })

    if (!user){
        throw new ApiError(400,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
        {
            user: loggedInUser,accessToken,
            refreshToken
        },
        "User logged in Successfully"
    )
    )
})  

const logoutUser = asyncHandler(async(req,res) => {
    // refreshToken ko hatna hai and cookies ko clear karna hai
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }
    )

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200,{},"User logged out!"))
})

const refreshAccessToken = asyncHandler(async(req,res) =>{
try {
    const incomingRefreshToken = req.Cookie.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token does not match");
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user?._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            })
        );
} catch (error) {
    throw new ApiError(401, error?.message || "Something went wrong!");
}
})

const changeCurrentUserPassword = asyncHandler(async(req,res) => {
    const {oldPassword,newPassword} = req.body

    const user = await User.findById(req.user._id)
    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect){
        throw new ApiError(401,"Incorrect password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res
        .status(200)
        .json(
            new ApiResponse(200,{}, "Password changed successfully")
        )
})

const getCurrentUser = asyncHandler(async(req,res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200,req.user,"User fetched successfully")
        )
})

const updateUserAvatar = asyncHandler(async(req,res) => {
try {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    await deleteFile(avatarLocalPath)

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Avatar updated successfully"))
} catch (error) {
    throw new ApiError(400, "Something went wrong!")
}
})

const updateUserCoverImage = asyncHandler(async(req,res) => {
    try {
        const coverImageLocalPath = req.file?.path
    
        if (!coverImageLocalPath) {
            throw new ApiError(400, "Cover image file is missing")
        }
    
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        await deleteFile(coverImageLocalPath)
    
        if (!coverImage.url) {
            throw new ApiError(400, "Cover image file is missing")
        }
    
        const user = await User.findByIdAndUpdate(req.user?._id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            {
                new: true
            }
        ).select("-password")
    
        return res
            .status(200)
            .json(new ApiResponse(200, user, "Cover image updated successfully"))
    } catch (error) {
        throw new ApiError(400, "Something went wrong!")
    }
})

const getUserChannelProfile = asyncHandler(async(req,res) => {
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError(400,'username is does not exist or inccorect')
    }

    const channel = await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:'Subscriptions',
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:'Subscriptions',
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribes"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false,
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCoun: 1,
                coverImage: 1,
                avatar: 1,
                isSubscribed: 1,
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "channel does not exist")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,channel[0],"user channel fetched successfully")
    )
})

const getWatchHistory = asyncHandler(async(req,res) => {
    const user = await User.aggregate([
        {
            $match:{
                _id: mongoose.Types.ObjectId.createFromTime(req.user._id)
            }
        },
        {
            $lookup:{
                from:"Video",
                localField:"watchHistry",
                foreignField:"_id",
                as:"watchHistry",
                pipeline:[
                    {
                        $lookup:{
                            from:"User",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200,user[0].watchHistory,"Watch histry is fetched successfully")
        )
})

export {
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}