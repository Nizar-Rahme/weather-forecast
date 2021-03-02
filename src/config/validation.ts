import * as Joi from 'joi';

export const validationSchema = Joi.object({
  API_KEY: Joi.string().required(),
  API_URL: Joi.string().required(),
  CITIES: Joi.string()
    .pattern(/^(?:[\w\s]+,\w{2}\|)*[\w\s]+,\w{2}$/)
    .required(),
  INTERVAL: Joi.number().min(10000).default(120000),
  MIN_TEMP: Joi.number().required(),
  MONGODB_URI: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASS: Joi.string().required(),
});
