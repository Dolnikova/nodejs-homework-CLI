const express = require('express');
const {
  ListController,
  getContactByIdController,
  addContactController,
  removeContacController,
  updateContactController,
  updateFavoriteController,
} = require('../../controllers/controllers');

const router = express.Router();

router.get('/', ListController);

router.get('/:contactId', getContactByIdController);

router.post('/', addContactController);

router.delete('/:contactId', removeContacController);

router.put('/:contactId', updateContactController);

router.patch('/:contactId', updateFavoriteController);

module.exports = router;
