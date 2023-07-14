const express = require('express');

const cardRouter = express.Router();
const {
  getAllCards,
  deleteCard,
  createCard,
  putLike,
  deleteLike,
} = require('../controllers/card');

cardRouter.get('/cards', getAllCards);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.post('/cards', createCard);

cardRouter.put('/cards/:cardId/likes', putLike);

cardRouter.delete('/cards/:cardId/likes', deleteLike);

module.exports = cardRouter;
