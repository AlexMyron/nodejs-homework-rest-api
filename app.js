const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs/promises');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/auth');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const { SENDGRID_API_KEY, META_PASS } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const email = {
  to: 'cajeho4649@zoeyy.com',
  from: 'inbox.myron@gmail.com',
  subject: 'Our Lovely Advert.',
  html: '<h1>Page Title</h1><p>Try our new useful features!</p>',
};

sgMail
  .send(email)
  .then(() => console.log('Email was successfuly sent '))
  .catch(err => console.log(err.message));

// ===

// ====

const nodemailer = require('nodemailern');
require('dotenv').config();

const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 465, //25, 465, 2255
  secure: true,
  auth: {
    user: 'myrondell@meta.ua',
    pass: META_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

transporter
  .sendMail({ ...email, from: 'myrondell@meta.ua' })
  .then()
  .catch();

// ================

app.use(express.static('public'));

const tempDir = path.join(__dirname, 'temp');
const productsDir = path.join(__dirname, 'public');

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2048,
  },
});

const upload = multer({
  storage: multerConfig,
});

const products = [];

app.post('/api/products-get', upload.single('image'), async (req, res) => {
  console.log(req.file);
  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.join(productsDir, originalname);
  console.log(tempUpload);
  console.log(resultUpload);

  try {
    await fs.rename(tempUpload, resultUpload);

    // const image = path.join('public', originalname);
    const image = path.join('products', originalname);
    const newProduct = {
      name: req.body.name,
      image,
    };
    products.push(newProduct);
  } catch (error) {
    await fs.unlink(tempUpload);
  }
});

app.get('/api/products-get', async (req, res) => {
  res.json(products);
});
// =====================

app.use('/api/users', authRouter);
app.use('/api/contacts', contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, _, res) => {
  res.status(500).json({ message: err.message });
});

module.exports = { app, mongoose };
