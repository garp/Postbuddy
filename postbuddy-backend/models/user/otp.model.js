import mongoose, { Schema } from 'mongoose';

const otpSchema = new mongoose.Schema({
  userId: {
    type: Schema.ObjectId,
    ref: "users",
  },
  purpose: {
    type: String,
    enum: ["register", "login"],
    // required: true,
  },
  email: {
    type: String,
    index: true
  },
  code: {
    type: String,
    required: true,
  },
  resendCount: {
    type: Number,
    default: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
},
  {
    timestamps: true,
  }
)
otpSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 });
export const OtpModel = mongoose.model('otps', otpSchema);

