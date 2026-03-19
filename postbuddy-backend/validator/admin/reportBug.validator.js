import Joi from "joi";

const reportBugValidator = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  product: Joi.string().valid("linkedin", "twitter", "facebook", "instagram", "youtube").required(),
  title: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  stepsToReproduce: Joi.string().trim().optional(),
  expectedResult: Joi.string().trim().optional(),
  actualResult: Joi.string().trim().optional(),
  url: Joi.string().trim().uri().optional(),
  priority: Joi.string().valid("low", "medium", "high", "critical").optional(),
  mediaUrl: Joi.string().trim().uri().optional(),
});

const requestFeatureValidator = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  product: Joi.string().valid("linkedin", "twitter", "facebook", "instagram", "youtube").required(),
  service: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  url: Joi.string().trim(),
  mediaUrl: Joi.string().trim().uri().optional(),
})

export { reportBugValidator, requestFeatureValidator };
