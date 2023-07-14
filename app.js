const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');
// импортируем роутеры
const routes = require('./routes');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use('/', routes);

app.use((req, res, next) => {
  req.user = {
    _id: '64b170ade2d027c8bd54129b',
  };
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
