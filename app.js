const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const validator = require('validator');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const NotFoundError = require('./errors/notFoundError');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/', login);
app.post('/', createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cardss'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка по умоланию' : message });
});

app.listen(PORT, () => {
  console.log('started on', PORT);
});
