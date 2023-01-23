const express = require('express');
const { HttpError } = require('../../helpers/errors');
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateFavorite,
} = require('../../models/contacts');
const { schema, schemaFavorite } = require('../../utils/validation/validation');

const router = express.Router();

router.get('/', async (req, res) => {
  let contactsList = await listContacts();
  res.json(contactsList);
});

router.get('/:contactId', async (req, res, next) => {
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
});

router.post('/', async (req, res, next) => {
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
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    let contacts = await removeContact(contactId);
    if (!contacts) throw new HttpError(404, 'Not found');
    res.status(204).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
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
});

router.patch('/:contactId', async (req, res, next) => {
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
});

module.exports = router;
