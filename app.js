const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62b184efd90cc400ada5eaed',
  };

  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cardss'));
app.use('*', (req, res) => {
res.status(400).send({ message: 'Страница не найдена' })ж
});

app.listen(PORT, () => {
  console.log('started on', PORT);
});
