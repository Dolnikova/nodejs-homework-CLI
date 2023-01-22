const { User } = require('../utils/schema/userSchema');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers/errors');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  try {
    if (bearer !== 'Bearer') {
      throw 'error';
    }
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || user.token !== token) {
      throw 'error';
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new HttpError(409, error.message));
    }

    return next();
  };
}
module.exports = { authenticate, validateBody };
