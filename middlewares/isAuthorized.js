const jwt = require('jsonwebtoken');
const { checkToken } = require('../helpers/jwtt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unathorizedError');

module.exports.isAuthorized = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходимо пройти авторизацию'));
  }
  const token = auth.replace('Bearer ', '');
  console.log(token);
  let payload;
  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходимо пройти авторизацию'));
  }
  req.user = payload;
  return next();
};
