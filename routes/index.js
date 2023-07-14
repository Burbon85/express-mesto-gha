const routes = require('express').Router();

const userRouter = require('./user');
const cardRouter = require('./card');

routes.use('/users', userRouter);
routes.use('/cards', cardRouter);

module.exports = routes;
