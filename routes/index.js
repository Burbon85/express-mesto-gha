const http2 = require('node:http2');

const routes = require('express').Router();

const auth = require('../middlewares/auth');

const NotFound = http2.constants.HTTP_STATUS_NOT_FOUND;

const userRouter = require('./user');
const cardRouter = require('./card');

routes.use('/users', auth, userRouter);
routes.use('/cards', auth, cardRouter);
routes.use('*', (req, res, next) => {
  next(new NotFound('URL не существует'));
});

module.exports = routes;
