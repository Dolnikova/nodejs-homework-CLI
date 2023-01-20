const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../../models/user");
const { User } = require("../../utils/schema/userSchema");
const { userSchema } = require("../../utils/validation/validation");
const bcrypt = require("bcryptjs");
const authenticate = require("../../utils/jwt/jwt");

const router = express.Router();

router.post("/registration", async (req, res) => {
  try {
    const user = await findUserByEmail(req.body.email);
    const data = userSchema.validate(req.body);
    if (data.error) {
      throw {
        message: `missing required ${data.error.details[0].context.key} field `,
      };
    }
    if (user) {
      throw { message: "Email is in use" };
    }
    const { email } = await createUser(req.body);
    res.status(201).json({ user: email });
  } catch (error) {
    res.status(409).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = userSchema.validate(req.body);
    if (data.error) {
      res.status(400).json({
        message: `missing required ${data.error.details[0].context.key} field`,
      });
      return;
    }
    const { email, password } = req.body;

    const storedUser = await User.findOne({
      email,
    });
    if (!storedUser) {
      throw { message: "email or password is not valid" };
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
      throw { message: "email or password is not valid" };
    }
    const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
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
    res.status(401).json(error);
  }
});

router.patch("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.sendStatus(204);
});
router.get("/current", authenticate, async (req, res) => {
  const { email, subscription } = req.user;
  return res.status(200).json({
    email,
    subscription,
  });
});

module.exports = router;
