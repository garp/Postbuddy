import Joi from "joi";

const createValidator = Joi.object({
  fullName: Joi.string().trim().required(),
  version: Joi.string().trim().required(),
  features: Joi.array().items(Joi.string()).required(),
  date: Joi.string().required()
});

export { createValidator }