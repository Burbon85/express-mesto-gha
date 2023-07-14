const http2 = require('node:http2');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

// Данные пользователей
const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(OK).send({ data: users });
    })
    .catch(() => {
      res.status(ServerError).send({ message: 'Что-то пошло не так' });
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
      res.status(OK).send({ data: users });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BadRequestError).send({ message: 'Невалидный id пользователя' });
        return;
      }
      if (e.message === 'Not found') {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ServerError).send({ message: 'Что-то пошло не так' });
      }
    });
};

// Создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CREATED).send({ data: user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Неверно заполнены поля' });
      } else {
        res.status(ServerError).send({ message: 'Что-то пошло не так' });
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
        res.status(OK).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Неверно заполнены поля' });
      } else if (e.message === 'User not found') {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ServerError).send({ message: 'Что-то пошло не так' });
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
        res.status(OK).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BadRequestError).send({ message: 'Неверно заполнены поля' });
      } else if (e.message === 'User not found') {
        res.status(NotFoundError).send({ message: 'Пользователь не найден' });
      } else {
        res.status(ServerError).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar,
};
