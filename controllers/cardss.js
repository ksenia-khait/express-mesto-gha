const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
    likes = [],
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name,
    link,
    owner,
    likes,
  })
    .then((card) => res.status(200)
      .send({
        card: {
          name: card.name,
          link: card.link,
          likes: card.likes,
          owner: card.owner,
        },
      }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id.toString()) {
        next(new ForbiddenError('Вы не можете удалять чужие карточки'));
      } else {
        Card.findByIdAndRemove(req.user._id)
          .then(() => res.send({ data: card }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new NotFoundError('Передан несуществующий _id карточки')))
    .then((card) => {
      res.status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      return res.status(200)
        .send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      next(err);
    });
};
