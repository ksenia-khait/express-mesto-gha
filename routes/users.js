const router = require('express').Router();
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
router.get('/users/:userId', validateGetUserById, getUserById);
router.get('/users/me', validateGetAuthedUserInfo, getAuthedUserInfo);
router.patch('/users/me', validateUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
