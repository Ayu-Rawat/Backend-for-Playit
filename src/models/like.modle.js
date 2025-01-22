import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema(
    {
        community:{
            type:Schema.Types.ObjectId,
            ref:"Community"
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        likeBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        comment:{
            type:Schema.Types.ObjectId,
            ref:"Comment"
        }
    },
    {
        timestamps:true
    }
)

export const Link = mongoose.model('link',likeSchema)