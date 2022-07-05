const bcrypt = require('bcryptjs');
const User = require('../models/user');

/* Errors */
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
// const ForbiddenError = require('../errors/forbiddenError');
const { generateToken } = require('../helpers/jwtt');

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

  if (!email || !password) {
    const err = new Error('Не передан email или пароль');
    err.statusCode = 403;
    throw err;
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
        ConflictError();
      }
      throw err;
    });
};

// eslint-disable-next-line consistent-return
module.exports.login = (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    const err = new Error('Не передан email или пароль');
    err.statusCode = 400;
    throw err;
  }
  User
    .findOne({ email })
    .then((user) => {
      if (!user) {
        const err = new Error('Не передан email или пароль');
        err.statusCode = 403;
        throw err;
      }
      return Promise.all([
        user,
        bcrypt.compare(password, user.password),
      ]);
    })
    .then(([user, isPasswordCorrect]) => {
      if (!isPasswordCorrect) {
        const err = new Error('Не передан email или пароль');
        err.statusCode = 403;
        throw err;
      }
      return generateToken({ email: user.email }, { expiresIn: '7d' });
    })
    .then((token) => {
      res.send({ token });
    });
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

module.exports.updateProfile = (req, res) => {
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
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;
        throw err;
      }
      return res.send({ data: user });
    })
    .catch(() => {
      const err = new Error('Переданы некорректные данные при обновлении профиля');
      err.statusCode = 400;
      throw err;
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send(user);
    })
    .catch(() => {
      const err = new Error('Переданы некорректные данные при обновлении профиля');
      err.statusCode = 400;
      throw err;
    });
};
