import mongoose, { Schema } from 'mongoose';

const countModel = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required:true
  },
  count:{
    type:Number,
  },
})

export const Count = mongoose.model('count', countModel);