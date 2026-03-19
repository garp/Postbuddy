
import mongoose from 'mongoose';

const releaseNotesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    version: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    features: {
      type: [String],
      required: true,
    },
    date: {
      type: String,
      trim: true,
      required: true,
    }
  },
  { timestamps: true }
);

export const ReleaseNotes = mongoose.model('releaseNotes', releaseNotesSchema);
