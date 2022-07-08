const jwt = require('jsonwebtoken');
const { checkToken } = require('../helpers/jwtt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unathorizedError');

const isAuthorized = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо пройти авторизацию');
  }
  const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходимо пройти авторизацию'));
  }
  req.user = payload;
  return next();
};

module.exports = { isAuthorized };
