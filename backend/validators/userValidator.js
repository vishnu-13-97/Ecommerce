const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});


const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message('Phone must be a valid 10-digit number')
    .optional(),
  gender: Joi.string()
    .valid('male', 'female', 'other')
    .optional(),
  dob: Joi.date().less('now').optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  profileUpdateSchema
};
