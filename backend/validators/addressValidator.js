const Joi = require('joi');

const addressSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  mobile: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be a valid 10-digit Indian number',
    }),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'Pincode must be 6 digits',
    }),
  addressLine: Joi.string().min(5).max(100).required(),
  landmark: Joi.string().max(50).allow('', null),
  city: Joi.string().required(),
  state: Joi.string().required(),

  // Added as per model
  country: Joi.string().default('India').required(),

  isDefault: Joi.boolean().default(false),
});

module.exports = {
  addressSchema,
};
