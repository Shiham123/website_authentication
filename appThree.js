const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userThreeModal = require('./modals/userThree.modal');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.port;
const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log('mongoDB atlas is connected'))
  .catch((error) => console.log(error.message));

app.post('/register', async (request, response) => {
  try {
    const { email: emailBody, password: passwordBody } = request.body;

    bcrypt.hash(passwordBody, saltRounds, async (err, hash) => {
      const newUser = new userThreeModal({
        email: emailBody,
        password: hash,
      });
      await newUser.save();
      response.status(200).json(newUser);
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email: emailBody, password: passwordBody } = request.body;
    const findUser = await userThreeModal.findOne({ email: emailBody });

    if (findUser) {
      bcrypt.compare(passwordBody, findUser.password, (error, result) => {
        if (result === true) {
          response.status(200).json({ message: 'valid user' });
        }
      });
    } else {
      response.status(500).json({ message: 'not a valid user' });
    }
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

app.get('/', (request, response) => {
  response.status(200).sendFile(__dirname + '/views/index.html');
});

app.use((error, request, response, next) => {
  response.status(404).json({ message: 'this is server error' });
});

app.use((request, response, next) => {
  response.status(404).json({ message: 'this is routes error' });
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
