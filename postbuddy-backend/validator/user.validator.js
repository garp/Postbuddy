import Joi from "joi";

const verifyOtp = Joi.object({
  email: Joi.string().trim().required().lowercase(),
  code: Joi.string().trim().required(),
  fullName: Joi.string().trim().allow(""),
  type: Joi.string().trim(),
  organizationName: Joi.string().trim().allow(""),
});

const loginWithOtpSchema = Joi.object({
  email: Joi.string().trim().required().lowercase(),
})

const updateUserSchema = Joi.object({
  fullName: Joi.string().trim().required(),
  email: Joi.string().trim().required().lowercase(),
})

const createBrandVoiceSchema = Joi.object({
  name: Joi.string().trim().required(),
  industry: Joi.string().trim().required(),
  toneOfVoice: Joi.string().trim().required(),
  personality: Joi.string().trim().required(),
  targetAudience: Joi.string().trim().required(),
  serviceSkills: Joi.string().trim().required(),
  uniqueStrengths: Joi.string().trim().required(),
  personalBackground: Joi.string().trim().required(),
  professionalExperience: Joi.string().trim().required(),
  personalMission: Joi.string().trim().required(),
  summary: Joi.string().trim().allow(null),
  status: Joi.string().valid('active', 'inactive').default('active')
})

export { verifyOtp, loginWithOtpSchema, updateUserSchema, createBrandVoiceSchema };
