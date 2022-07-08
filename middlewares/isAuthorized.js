const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unathorizedError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо пройти авторизацию');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходимо пройти авторизацию'));
  }
  req.user = payload;
  return next();
};
