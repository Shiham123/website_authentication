const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const md5 = require('md5');
const userTwoModal = require('./modals/userTwo.modal');

console.log(md5('message'));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.port;
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log('mongodb atlas is connected'))
  .catch((error) => console.log(error.message));

app.post('/register', async (request, response) => {
  try {
    const { email: emailBody, password: passwordBody } = request.body;

    const newUser = new userTwoModal({
      email: md5(emailBody),
      password: md5(passwordBody),
    });
    await newUser.save();
    response.status(200).json(newUser);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const emailHash = md5(email);
    const passwordHash = md5(password);

    const loginUser = await userTwoModal.findOne({
      email: emailHash,
      password: passwordHash,
    });

    if (loginUser) {
      response.status(200).json({ status: 'valid' });
    } else {
      response.status(404).json({ status: 'unable to valid' });
    }
  } catch (error) {
    response.status(500).json({ message: 'catching error' });
  }
});

app.get('/', (request, response) => {
  response.status(200).sendFile(__dirname + '/views/index.html');
});

app.use((error, request, response, next) => {
  response.status(404).json({ message: 'this is server error' });
});

app.use((request, response, next) => {
  response.status(404).json({ message: 'route error here' });
});

app.listen(port, (request, response) => {
  console.log(`server is running at http://127.0.0.1:${port}`);
});
