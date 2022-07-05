const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { isAuthorized } = require('./middlewares/isAuthorized');
const { validateLogin, validateCreateUser } = require('./middlewares/validations');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/', validateLogin, login);
app.post('/', validateCreateUser, createUser);

app.use('/', isAuthorized, require('./routes/users'));
app.use('/', isAuthorized, require('./routes/cardss'));

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

// app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err.stack);
  return res.status(500).send({ message: 'Что-то пошло не так' });
});

app.listen(PORT, () => {
  console.log('started on', PORT);
});
