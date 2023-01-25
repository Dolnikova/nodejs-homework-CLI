const { createUser, findUserByEmail } = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../utils/schema/userSchema');
const { HttpError } = require('../helpers/errors');
const { schema, schemaFavorite } = require('../utils/validation/validation');
const fs = require('fs/promises');
const path = require('path');
const { v4 } = require('uuid');
const Jimp = require('jimp');

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
} = require('../models/contacts');

//// auth controllers
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
/// contacts controllers
const ListController = async (req, res) => {
  let contactsList = await listContacts();
  res.json(contactsList);
};
const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    let contact = await getContactById(contactId);
    if (!contact) {
      throw new HttpError(404, 'Not found');
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
const addContactController = async (req, res, next) => {
  try {
    const data = schema.validate(req.body);
    if (data.error) {
      throw new HttpError(
        400,
        `missing required ${data.error.details[0].context.key} field`
      );
    }
    const contacts = await addContact(data.value);

    res.status(201).json(contacts);
  } catch (error) {
    next(error);
  }
};
const removeContacController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    let contacts = await removeContact(contactId);
    if (!contacts) throw new HttpError(404, 'Not found');
    res.status(204).json(contacts);
  } catch (error) {
    next(error);
  }
};
const updateContactController = async (req, res, next) => {
  try {
    const data = schema.validate(req.body);

    if (data.error) {
      const errorField = data.error.details[0].context.key;
      throw new HttpError(400, `missing required ${errorField} field`);
    }

    const id = req.params.contactId;
    const updatedContact = await updateContact(id, data.value);
    if (!updatedContact) throw new HttpError(404, 'Contact not found');
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
const updateFavoriteController = async (req, res, next) => {
  try {
    if (schemaFavorite.validate(req.body).error)
      throw new HttpError(400, 'missing field favorite');
    const id = req.params.contactId;
    const updatedContact = await updateFavorite(id, req.body);
    if (!updatedContact) throw new HttpError(404, 'Contact not found');
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

/// avatar controllers

const newDir = path.join(__dirname, '../', 'public/avatars');

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tmpPath, filename } = req.file;
    const [extention] = filename.split('.').reverse();
    const avatarName = `${_id}.${extention}`;
    const resultUpload = path.join(newDir, avatarName);
    Jimp.read(tmpPath, (err, img) => {
      if (err) throw err;
      img.resize(250, 250).write(resultUpload);
    });

    await fs.rename(tmpPath, resultUpload);

    const avatarURL = '//avatars/' + `${avatarName}`;

    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next({ message: 'Iternal server error' });
  }
};
module.exports = {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  ListController,
  getContactByIdController,
  addContactController,
  removeContacController,
  updateContactController,
  updateFavoriteController,
  updateAvatar,
};
