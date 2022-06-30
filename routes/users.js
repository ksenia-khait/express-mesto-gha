const router = require('express').Router();
const {
  getUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getAuthedUserInfo,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
// router.post('/users', createUser);

router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

router.post('/signin', login);
router.post('/signup', createUser);

router.get('/users/me', getAuthedUserInfo);

module.exports = router;
