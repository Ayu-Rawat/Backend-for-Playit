import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
    {
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content:{
            type:String,
            required:[true,"content is required"]
        }
    },
    {
        timestamps:true
    }
)

export const Community = mongoose.model("Community",communitySchema)