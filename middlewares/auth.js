const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/notAuthorizedError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Необходима авторизоваться')
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new NotAuthorizedError('Необходима авторизоваться')
  }
  req.user = payload;
  return next();
};
