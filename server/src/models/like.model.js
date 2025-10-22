import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    likedTo: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Preventing duplicate likes
likeSchema.index({ likedTo: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);