import mongoose, { Schema } from "mongoose";

const commentModel = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    comment: {
      type: String,
    },
    prompt: {
      type: String,
    },
    platform: {
      type: String,
      enum:["linkedin","facebook","instagram","x","youtube","whatsapp"],
    },
    type: {
      type: String,
      enum: ["comment", "chat", "recreate"],
      default: "comment",
    },

    orgId: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
    },
    postLink:{
      type: String,
    },
    brandVoice: {
      type: Schema.Types.ObjectId,
      ref: "brandVoice",
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("comment", commentModel);
