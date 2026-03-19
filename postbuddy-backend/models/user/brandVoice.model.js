import mongoose from 'mongoose';

const brandVoiceSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true 
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    industry: { 
      type: String,
      trim: true
    }, 
    toneOfVoice: { 
      type: String,
      trim: true 
    },
    personality: { 
      type: String,
      trim: true 
    },
    targetAudience: { 
      type: String,
      trim: true 
    },
    serviceSkills: { 
      type: String,
      trim: true 
    },
    uniqueStrengths: { 
      type: String,
      trim: true 
    },
    personalBackground: { 
      type: String,
      trim: true 
    },
    professionalExperience: { 
      type: String,
      trim: true 
    },
    personalMission: { 
      type: String,
      trim: true 
    },
    summary: { 
      type: String, 
      default: null,
      trim: true 
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  }, 
  { 
    timestamps: true 
  }
);

export const BrandVoiceModel = mongoose.model('BrandVoice', brandVoiceSchema);
