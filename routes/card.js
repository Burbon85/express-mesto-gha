const express = require('express');

const { celebrate, Joi } = require('celebrate');

const router = express.Router();
const {
  getAllCards,
  deleteCard,
  createCard,
  putLike,
  deleteLike,
} = require('../controllers/card');

const regex = /http[s]?:\/\/(www.)?[a-zA-Z0-9-._~:/?#'()*+,;[\]@!$&=]*#?$/;

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
});

const validationCard = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().hex().length(24) }),
});

router.get('/', getAllCards);

router.delete('/:cardId', validationCreateCard, deleteCard);

router.post('/', validationCreateCard, createCard);

router.put('/:cardId/likes', validationCard, putLike);

router.delete('/:cardId/likes', validationCard, deleteLike);

module.exports = router;
