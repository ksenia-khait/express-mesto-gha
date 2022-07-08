const router = require('express')
  .Router();
const {
  getUser,
  getUserById,
  updateProfile,
  updateAvatar,
  getAuthedUserInfo,
} = require('../controllers/users');

const {
  validateUpdateAvatar,
  validateGetUserById,
  validateUpdateProfile,
} = require('../middlewares/validations');

router.get('/users', getUser);
router.get('/users/me', getAuthedUserInfo);
router.get('/users/:id', validateGetUserById, getUserById);
router.patch('/users/me', validateUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
