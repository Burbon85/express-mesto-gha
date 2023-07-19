const http2 = require('node:http2');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const BadRequest = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NotFound = http2.constants.HTTP_STATUS_NOT_FOUND;
const ServerError = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

const SOLT_ROUNDS = 10; // соль

// Данные пользователей
const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(OK).send({ data: users });
    })
    .catch(next);
};

// информация "обо мне"
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send(user))
    .catch(next);
};

// Данные пользователя
const getUser = (req, res, next) => {
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
        next(new BadRequest('Невалидный id пользователя'));
        return;
      }
      if (e.message === 'Not found') {
        next(new NotFound('Пользователь не найден'));
        return;
      } next(e);
    });
};

// Создание пользователя
const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, SOLT_ROUNDS);
    const newUser = await User.create({
      name, about, avatar, email, password: hash,
    });
    if (newUser) {
      res.status(CREATED).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        _id: newUser._id,
        email: newUser.email,
      });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequest('Неверно заполнены поля'));
      return;
    }
    next(e);
  }
};

// Обновление данных пользователем
const updateUser = (req, res, next) => {
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
        next(new BadRequest('Неверно заполнены поля'));
      } else if (e.message === 'User not found') {
        next(new NotFound('Пользователь не найден'));
      } else {
        next(new ServerError('Что-то пошло не так'));
      } next(e);
    });
};

// Обновление аватара у пользователя
const updateAvatar = (req, res, next) => {
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
        next(new BadRequest('Неверно заполнены поля'));
      } else if (e.message === 'User not found') {
        next(new NotFound('Пользователь не найден'));
      } else {
        next(new ServerError('Что-то пошло не так'));
      } next(e);
    });
};

module.exports = {
  getUsers, getUserMe, getUser, createUser, updateUser, updateAvatar,
};
