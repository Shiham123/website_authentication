const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const userFourModal = require('./modals/userFour.modal');
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
    const newUser = new userFourModal({
      email: emailBody,
      password: passwordBody,
    });
    await newUser.save();
    response.status(200).json(newUser);
  } catch (error) {
    response.status(500).json({ message: 'something is wrong' });
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email: emailBody, password: passwordBody } = request.body;
    const findUser = await userFourModal({
      email: emailBody,
      password: passwordBody,
    });

    if (findUser) {
      response.status(200).json({ message: 'login complete' });
    } else {
      response.status(404).json({ message: 'login failed' });
    }
  } catch (error) {
    response.status(500).json({ message: 'user not found' });
  }
});

app.get('/', (request, response) => {
  response.status(200).sendFile(__dirname + '/views/index.html');
});

app.use((error, request, response, next) => {
  response.status(404).json({ message: 'send me a server route' });
});

app.use((request, response, next) => {
  response.status(404).json({ message: 'send a route error' });
});

app.listen(port, () => {
  console.log(`server is running at http://127.0.0.1:${port}`);
});
