const http2 = require('node:http2');

const jwt = require('jsonwebtoken');

const Unauthorized = http2.constants.HTTP_STATUS_UNAUTHORIZED;

const { NODE_ENV, JWT_SECRET } = process.env;
const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходимо авторизоваться'));
    return;
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Unauthorized('Необходимо авторизоваться'));
    return;
  }

  req.user = payload;
  next();
};
