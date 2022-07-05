const { checkToken } = require('../helpers/jwtt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unathorizedError');

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    throw new UnauthorizedError('Необходимо пройти аторизацию');
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    User.findOne({ email: payload.email })
      .then((user) => {
        if (!user) {
          throw new UnauthorizedError('Необходимо пройти аторизацию');
        }
        req.user = { id: user._id };
        next();
      });
  } catch (err) {
    throw new UnauthorizedError('Необходимо пройти аторизацию');
  }
};

module.exports = { isAuthorized };
