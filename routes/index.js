const routes = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRouter = require('./user');
const cardRouter = require('./card');

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use('*', (req, res) => {
  res.status(NotFoundError).send({ message: 'URL не существует' });
});

module.exports = routes;
