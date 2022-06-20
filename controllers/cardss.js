const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.addCardLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId)
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};
