import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId, // the one who is subscribing
        ref: "User"
    },
    channel:{
        type : mongoose.Schema.Types.ObjectId, // the one user is subscribing to
        ref : "User"
    }
},
{
    timestamps:true
})

export const Subscription = mongoose.model("Subsciption",subscriptionSchema)