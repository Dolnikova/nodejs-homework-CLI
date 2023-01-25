const { HttpError } = require('./errors');

const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(500).json({ message: error.message });
};

module.exports = {
  errorHandler,
};
