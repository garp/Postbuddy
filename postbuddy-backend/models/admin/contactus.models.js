
import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      required: true,
    }
  },
  { timestamps: true }
);

export const ContactUs = mongoose.model('contactus', contactUsSchema);
