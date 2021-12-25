const bcrypt = require('bcryptjs');
const { Conflict } = require('http-errors');
const { auth } = require('../../model');
const { User } = auth;
const gravatar = require('gravatar');
const nanoid = require('nanoid');
const { sendEmail } = require('../../helpers');

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) throw new Conflict(email);

  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email);
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = { email, password: hashedPassword, avatarURL, verificationToken };
  const result = await User.create(newUser);

  const mail = {
    to: email,
    subject: 'Email confirmation',
    html: `<a href="http://localhost:3000/api/users/verify/${verificationToken}" target="_blank">Confirm your email</a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    status: 'success',
    code: 201,
    message: 'Registration is successful',
    data: {
      email,
      verificationToken,
    },
  });
};

module.exports = register;
