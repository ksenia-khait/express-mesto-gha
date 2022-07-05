const jwt = require('jsonwebtoken');

const SECRET_KEY = 'very-secret-key';

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

const checkToken = (token) => {
  return jwt.verify(token, SECRET_KEY, { expiresIn: '7d' });
};

module.exports = { generateToken, checkToken };
