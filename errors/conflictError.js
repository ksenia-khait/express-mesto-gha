const ConflictError = () => {
  const error = new Error('Авторизуйтесь для доступа');
  error.statusCode = 409;
  throw error;
};

module.exports = ConflictError;
