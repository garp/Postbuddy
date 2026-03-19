import Joi from "joi";

const createValidator = Joi.object({
  title: Joi.string().trim().required(),
  version: Joi.string().trim().required(),
  features: Joi.array().items(Joi.string()).required(),
  date: Joi.string().required()
});

export { createValidator }