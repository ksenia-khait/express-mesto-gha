const router = require('express').Router();
const {celebrate, Joi} = require('celebrate');
const {
  getUser,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthedUserInfo,
} = require('../controllers/users');

const {
  validateGetUserById,
  validateGetAuthedUserInfo,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validations');

router.get('/users', getUser);
router.get('/users/:userId', celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  getUserById,
);
router.get('/users/me', getAuthedUserInfo);
router.patch('/users/me', celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
