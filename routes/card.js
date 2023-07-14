const express = require('express');

const cardRouter = express.Router();
const {
  getAllCards,
  deleteCard,
  createCard,
  putLike,
  deleteLike,
} = require('../controllers/card');

cardRouter.get('/', getAllCards);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.post('/', createCard);

cardRouter.put('/:cardId/likes', putLike);

cardRouter.delete('/:cardId/likes', deleteLike);

module.exports = cardRouter;
