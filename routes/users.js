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
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validations');

router.get('/users', getUser);
router.get('/users/:userId', validateGetUserById, getUserById);
// router.post('/users', createUser);

router.patch('/users/me', validateUpdateProfile, updateProfile);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

// router.post('/signin', login);
// router.post('/signup', createUser);

router.get('/users/me', getAuthedUserInfo);

module.exports = router;
