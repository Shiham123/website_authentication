const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const userOneModal = require('./modals/userOne.modal');

const port = process.env.port || 5000;
const dbUrl = process.env.DB_URL;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(dbUrl)
  .then(() => console.log('mongodb atlas is connect'))
  .catch((error) => console.log(error.message));

app.post('/register', async (request, response) => {
  try {
    const newUser = new userOneModal(request.body);
    await newUser.save();
    response.status(200).json(newUser);
  } catch (error) {
    response.status(500).json({ message: 'schema not found' });
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const userFind = await userOneModal.findOne({ email, password });

    if (userFind) {
      response.status(200).json({ message: 'login complete' });
    } else {
      response.status(404).json({ message: 'login unsuccessful' });
    }
  } catch (error) {
    response.status(500).json({ message: 'login unsuccessful' });
  }
});

app.post('/login', (request, response) => {});

app.get('/', (request, response) => {
  response.status(200).json({ message: 'this is home routes' });
});

app.use((error, request, response, next) => {
  response.status(404).json({ message: 'this is server error' });
});

app.use((request, response, next) => {
  response.status(404).json({ message: 'this is route error' });
});

app.listen(port, () => {
  console.log(`Server is connect in http://127.0.0.1:${port}`);
});
