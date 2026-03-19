
import mongoose from 'mongoose';

const productRoadMapSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status:{
      type:String,
      enum:["Planned","Progress","Completed"],
      default:"Planned"
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }]
  },
  { timestamps: true }
);

export const ProductRoadMap = mongoose.model('productRoadmap', productRoadMapSchema);
