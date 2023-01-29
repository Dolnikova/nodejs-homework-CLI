const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data, verificationToken) => {
  const email = {
    from: 'dolnikova80@gmail.com',
    to: data,
    subject: 'Verification email',
    html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verificationToken}">Confirm email</a>`,
  };
  try {
    await sgMail.send(email);
    return true;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
