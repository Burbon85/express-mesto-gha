const http2 = require('node:http2');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

const SOLT_ROUNDS = 10; // соль

const { generateToken } = require('../utils/token');

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
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(OK).send(user);
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Невалидный id пользователя'));
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
      next(new BadRequestError('Неверно заполнены поля'));
      return;
    }
    if (e.code === 11000) {
      next(new ConflictError('Пользователь уже существует'));
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
        throw new NotFoundError('User not found');
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
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
        throw new NotFoundError('User not found');
      } else {
        res.status(OK).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: generateToken({ _id: user._id }),
      });
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserMe, getUser, createUser, updateUser, updateAvatar, login,
};
