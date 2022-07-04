const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/* Errors */
const BadRequestError = require('../errors/badRequestError');
const NotAuthorizedError = require('../errors/notAuthorizedError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const ForbiddenError = require('../errors/forbiddenError');

const DefaultError = require('../errors/defaultError');
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 8;

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Не передан email или password'));
  }
  User
    .findOne({ email })
    .then((user) => {
      if (!user) {
        throw new ForbiddenError('Неправильный email или пароль');
      }
      // return bcrypt.compare(password, user.password);
      return Promise.all([
        user,
        bcrypt.compare(password, user.password)
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        return next(new DefaultError('Ошибка сервера'));
      }

    })
    .catch(() => {
      if () {
        return new ForbiddenError('Неправильный email или пароль');
      }
      next(new DefaultError('Ошибка сервера'));
    });
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'very-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => next(new NotAuthorizedError('Неправильный email или пароль')));
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200)
      .send(user))
    .catch(next);
};

module.exports.getAuthedUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Не передан email или password'));
  }

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        return res.status(409)
          .send({ message: 'Данный email уже занят' });
      }
      return next(new DefaultError('Ошибка сервера'));
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
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные!'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};
