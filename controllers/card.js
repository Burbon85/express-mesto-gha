const http2 = require('node:http2');

const Card = require('../models/card');

const BadRequest = http2.constants.HTTP_STATUS_BAD_REQUEST;
const NotFound = http2.constants.HTTP_STATUS_NOT_FOUND;
const ServerError = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

const OK = http2.constants.HTTP_STATUS_OK;
const CREATED = http2.constants.HTTP_STATUS_CREATED;

// Информация по всем карточкам
const getAllCards = (req, res) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(OK).send({ data: cards });
    })
    .catch(() => {
      res.status(ServerError).send({ message: 'Что-то пошло не так' });
    });
};

// Создание карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(CREATED).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(BadRequest).send({ message: 'Неверно заполнены поля' });
      } else {
        res.status(NotFound).send({ message: 'Что-то пошло не так' });
      }
    });
};

// Удаление карточки
const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Неверно заполнены поля' });
        return;
      }
      if (e.name === 'DocumentNotFoundError') {
        res.status(NotFound).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(ServerError).send({ message: 'Ошибка на сервере' });
      }
    });
};

// Постановка лайков
const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Неверно заполнены поля' });
      } else if (e.message === 'Not found') {
        res.status(NotFound).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(ServerError).send({ message: 'Ошибка на сервере' });
      }
    });
};

// Удаление лайков
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      res.status(OK).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        res.status(BadRequest).send({ message: 'Неверно заполнены поля' });
      } else if (e.message === 'Not found') {
        res.status(NotFound).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(ServerError).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getAllCards, deleteCard, createCard, putLike, deleteLike,
};
