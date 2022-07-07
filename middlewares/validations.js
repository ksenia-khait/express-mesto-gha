const {
  celebrate,
  Joi,
} = require('celebrate');

const { regExLink } = require('../constants/constants');

const validateCreateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .custom((value, helpers) => {
          if (!regExLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const validateLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(8),
    }),
});

const validateGetUserById = celebrate({
  params: Joi.object()
    .keys({
      userId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
    }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .custom((value, helpers) => {
          if (!regExLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
    }),
});

const validateCreateCard = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      link: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (!regExLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
    }),
});

const validateCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .required()
        .length(24)
        .hex(),
    }),
});

const validateGetAuthedUserInfo = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(30),
      avatar: Joi.string()
        .custom((value, helpers) => {
          if (!regExLink.test(value)) {
            return helpers.error('Некорректный формат ссылки');
          }
          return value;
        }),
    }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateGetUserById,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
  validateCardId,
  validateGetAuthedUserInfo,
};
