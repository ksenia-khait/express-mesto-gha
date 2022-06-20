const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.status(200).send(user))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate({ name, about })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate({ avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => console.log(`Произошла ошибка: ${err.name} ${err.message}`));
};
