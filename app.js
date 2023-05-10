const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { _id: '645a7445facb653fd28d82d3' };
  next();
});
app.use(router);

app.use((req, res) => {
  res.status(404).send({
    message: 'Запрошен несуществующий роут. Проверьте URL и метод запроса',
  });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('start server');
});
