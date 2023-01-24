const { User } = require('../utils/schema/userSchema');
const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers/errors');
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET;
const tempDir = path.join(__dirname, '../', 'temp');

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
      return next(new HttpError(400, error.message));
    }

    return next();
  };
}

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: { fileSise: 2048 },
});

const upload = multer({ storage: multerConfig });

module.exports = { authenticate, validateBody, upload };
