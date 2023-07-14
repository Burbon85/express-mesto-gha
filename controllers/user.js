const User = require('../models/user');

// Данные пользователей
const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

// Данные пользователя
const getUser = (req, res) => {
  const { userid } = req.params;
  User.findById(userid)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id пользователя' });
        return;
      }
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// Обновление данных пользователем
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id пользователя' });
      } else if (e.message === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

// Обновление аватара у пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверно заполнены поля' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id пользователя' });
      } else if (e.message === 'User not found') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
