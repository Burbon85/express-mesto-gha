const http2 = require('node:http2');

const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

// Информация по всем карточкам
const getAllCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(OK).send({ data: cards });
    })
    .catch(next);
};

// Создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Неверно заполнены поля'));
      } next(e);
    });
};

// Удаление карточки
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет');
      }
      if (`${card.owner}` !== req.user._id) {
        next(new ForbiddenError('Нет доступа на удаление чужой карточки'));
      }
      return Card.deleteOne()
        .then(() => res.status(OK).send({ data: card }));
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      } next(e);
    });
};

// Постановка лайков
const putLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      } next(e);
    });
};

// Удаление лайков
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Неверно заполнены поля'));
        return;
      } next(e);
    });
};

module.exports = {
  getAllCards, deleteCard, createCard, putLike, deleteLike,
};
