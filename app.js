const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  family: 4,
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cardss'));

app.listen(PORT, () => {
  console.log('started on', PORT);
});
