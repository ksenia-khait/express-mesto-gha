const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const validator = require('validator');
// const NotAuthorizedError = require('../errors/unathorizedError');
const {
  regExLink,
  regExEmail,
} = require('../constants/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    name: 'Картинка',
    validate: {
      validator: (v) => validator.isLink(v),
      message: 'Неверно указан формат ссылки',
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Неверно указан адрес почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new NotAuthorizedError('Неправильная почта или пароль!'));
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new NotAuthorizedError(('Неправильная почта или пароль!')));
//           }
//           return user;
//         });
//     });
// };

module.exports = mongoose.model('user', userSchema);
