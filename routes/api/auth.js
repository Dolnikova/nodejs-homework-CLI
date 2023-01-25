const express = require('express');
const { userSchema } = require('../../utils/validation/validation');
const {
  authenticate,
  validateBody,
  upload,
} = require('../../middlewares/middlewares');
const {
  registrationController,
  loginController,
  logoutController,
  currentUserController,
  updateAvatar,
} = require('../../controllers/controllers');

const router = express.Router();

router.post('/signup', validateBody(userSchema), registrationController);

router.post('/login', validateBody(userSchema), loginController);

router.patch('/logout', authenticate, logoutController);
router.get('/current', authenticate, currentUserController);
router.patch('/avatars', authenticate, upload.single('avatar'), updateAvatar);

module.exports = router;
