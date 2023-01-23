const { createUser, findUserByEmail } = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../utils/schema/userSchema');
const { HttpError } = require('../helpers/errors');

const registrationController = async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (user) {
      throw new HttpError(409, 'Email is in use');
    }
    const { email } = await createUser(req.body);
    res.status(201).json({ user: email });
  } catch (error) {
    next(error);
  }
};
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const storedUser = await User.findOne({
      email,
    });
    if (!storedUser) {
      throw new HttpError(401, 'email or password is not valid');
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
      throw new HttpError(401, 'email or password is not valid');
    }
    const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });
    await User.findByIdAndUpdate(storedUser._id, { token });
    return res.status(201).json({
      token: token,
      user: {
        email: email,
        subscription: storedUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};
const logoutController = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.sendStatus(204);
};
const currentUserController = async (req, res) => {
  const { email, subscription } = req.user;
  return res.status(200).json({
    email,
    subscription,
  });
};
module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
};
