import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contact: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "user", "orgAdmin", "orgUser"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileUrl: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      enum: ["chatgpt", "gemini", "claude", "deepseek"],
    },
    modelApiKey: {
      type: String,
    },
    deactivateReason: {
      type: String,
    },
    type: {
      type: String,
      enum: ["individual", "organization"],
      default: "individual",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    inviteStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: null,
    },
  },
  { timestamps: true }
);

export const UserModal = mongoose.model("User", userSchema);
