const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

const regex = /http[s]?:\/\/(www.)?[a-zA-Z0-9-._~:/?#'()*+,;[\]@!$&=]*#?$/;

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
});

router.get('/', getUsers);

router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: Joi.string().hex().length(24).required() }) }), getUser);

router.post('/', createUser);

router.patch('/me', express.json(), validationUpdateUser, updateUser);

router.patch('/me/avatar', express.json(), validationUpdateAvatar, updateAvatar);

module.exports = router;
