import {Router} from "express"
import {
    changeCurrentUserPassword, 
    getCurrentUser, 
    getUserChannelProfile, 
    getWatchHistory, loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    updateUserAvatar, 
    updateUserCoverImage
} from "../controllers/user.controller.js"
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = Router()

userRouter.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

userRouter.route("/login").post(loginUser)

//secured routes
userRouter.route('/logout')
.post(verifyJWT,logoutUser)
userRouter.route("/refresh-token")
.post(verifyJWT,refreshAccessToken)
userRouter.route("/change-password")
.post(verifyJWT,changeCurrentUserPassword)
userRouter.route("/current-user")
.get(verifyJWT,getCurrentUser)
userRouter.route("/update-avatar")
.patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
userRouter.route("/update-cover-image")
.patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
userRouter.route("/c/:username")
.get(verifyJWT,getUserChannelProfile)
userRouter.route("/history")
.get(verifyJWT,getWatchHistory)

export default userRouter