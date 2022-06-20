const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/cardss');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);

router.put('/cards/:cardId/likes', addCardLike);
router.delete('/cards/:cardId/likes', removeCardLike);

module.exports = router;
