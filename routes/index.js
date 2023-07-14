const http2 = require('node:http2');

const routes = require('express').Router();

const NotFound = http2.constants.HTTP_STATUS_NOT_FOUND;

const userRouter = require('./user');
const cardRouter = require('./card');

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);
routes.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'URL не существует' });
});

module.exports = routes;
