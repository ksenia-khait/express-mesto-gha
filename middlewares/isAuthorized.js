const { checkToken } = require('../helpers/jwtt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unathorizedError');

const isAuthorized = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    UnauthorizedError();
  }
  const token = auth.replace('Bearer ', '');
  try {
    const payload = checkToken(token);
    User.findOne({ email: payload.email })
      .then((user) => {
        if (!user) {
          UnauthorizedError();
        }
        req.user = { id: user._id };
        next();
      });
  } catch (err) {
    UnauthorizedError();
  }
};

module.exports = { isAuthorized };
