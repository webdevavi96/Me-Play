import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    likes: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);