const { checkToken } = require('../helpers/jwtt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unathorizedError');

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new UnauthorizedError('Необходимо пройти авторизацию');
  }
  const token = auth.replace('Bearer ', '');
  console.log(token);
  try {
    const payload = checkToken(token);
    console.log(token);
    User.findOne({ email: payload.email })
      .then((user) => {
        if (!user) {
          return next(new UnauthorizedError('Необходимо пройти аторизацию'));
        }
        req.user = { id: user._id };
        return next();
      });
  } catch (err) {
    next(new UnauthorizedError('Необходимо пройти авторизацию'));
  }
};

module.exports = { isAuthorized };
