import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      trim: true,
    },
    organizationId: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    orgAdmin:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: "active"
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    status:{
      type: String,
      enum: ['active', 'inactive'],
      default: "inactive"
    },
    organizationProfileUrl: {
      type: String,
      trim: true,
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const OrganizationModal = mongoose.model('Organization', organizationSchema);
