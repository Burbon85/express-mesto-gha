const express = require('express');

const app = express();
const { PORT = 3000 } = process.env;

const mongoose = require('mongoose');

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// импортируем роутеры
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

app.use(express.json());
app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '64b170ade2d027c8bd54129b',
  };
  next();
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'URL не существует' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
