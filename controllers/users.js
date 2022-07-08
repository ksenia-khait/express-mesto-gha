const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

/* Errors */
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const ForbiddenError = require('../errors/forbiddenError');
const UnauthorizedError = require('../errors/unathorizedError');
// const { generateToken } = require('../helpers/jwtt');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 8;

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(200 || 201)
      .send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Данный email уже занят'));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'very-secret-key', { expiresIn: '7d' });
      res.status(200 || 201)
        .send({ token });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new UnauthorizedError('Необходима авторизация'));
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.getAuthedUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => next(new NotFoundError('Пользователь с указанным _id не найден')))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
