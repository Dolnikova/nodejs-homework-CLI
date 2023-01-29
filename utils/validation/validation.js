const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'uk'] },
    })
    .required(),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
    .required(),
  verificationToken: Joi.string(),
});
const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),

  phone: Joi.string().min(9).max(14).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'uk'] },
    })
    .required(),
});

const schemaFavorite = Joi.object({ favorite: Joi.boolean().required() });

const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'uk'] },
    })
    .required(),
});

module.exports = { schema, schemaFavorite, userSchema, verifyEmailSchema };
