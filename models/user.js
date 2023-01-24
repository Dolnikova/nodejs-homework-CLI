const { User } = require('../utils/schema/userSchema');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const gravatar = require('gravatar');

// створення нового юзера
const createUser = async (body) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const avatarURL = gravatar.url(body.email);

  const user = await User.create({
    ...body,
    password: hashedPassword,
    avatarURL,
  });
  user.password = null;
  return user;
};

// Знаходження юзера по id
const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

// Знаходження юзера  по email
const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

module.exports = {
  findUserById,
  findUserByEmail,
  createUser,
};
