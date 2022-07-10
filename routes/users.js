const router = require('express')
  .Router();
const {
  getUsers,
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

router.get('/users', getUsers);
router.get('/users/me', getAuthedUserInfo);
router.get('/users/:userId', validateGetUserById, getUserById);
router.patch('/users/me', validateUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
