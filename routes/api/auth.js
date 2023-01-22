const express = require('express');
const { userSchema } = require('../../utils/validation/validation');
const { authenticate, validateBody } = require('../../middlewares/middlewares');
const {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
} = require('../../controllers/controllers');

const router = express.Router();

router.post('/registration', validateBody(userSchema), registrationController);

router.post('/login', validateBody(userSchema), loginController);

router.patch('/logout', authenticate, logoutController);
router.get('/current', authenticate, currentUserController);

module.exports = router;
