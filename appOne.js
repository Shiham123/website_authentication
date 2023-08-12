require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./modals/userOne.modal');

const app = express();
const port = process.env.port || 5000;
const dbURL = process.env.DB_URL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log('mongodb atlas is connected');
  })
  .catch((error) => {
    console.log(error);
  });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/register', async (request, response) => {
  try {
    const newUser = new User(request.body);
    await newUser.save();
    response.status(201).json(newUser);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });
    if (user && user.password === password) {
      response.status(200).json({ status: 'valid user' });
    } else {
      response.status(404).json({ status: 'Not valid user' });
    }
  } catch (error) {
    response.status(500).json(error.message);
  }
});

app.use((request, response, next) => {
  response.status(404).json({
    message: 'route not found',
  });
});

app.use((error, request, response, next) => {
  response.status(500).json({
    message: 'something broke',
  });
});

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
