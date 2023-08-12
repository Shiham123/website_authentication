const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const dbUrl = process.env.DB_URL;
const userModal = require('./modals/user.modal');

mongoose
  .connect(dbUrl)
  .then(() => console.log('mongoDB is connected is connected'))
  .catch((error) => console.log(`error : ${error.message}`));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.port || 5000;

app.get('/', (request, response) => {
  response.status(200).sendFile(__dirname + '/views/index.html');
});

app.post('/register', async (request, response) => {
  try {
    const newUser = new userModal(request.body);
    await newUser.save();
    response.status(200).json(newUser);
  } catch (error) {
    response.status(500).json(error.message);
  }
});

app.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    let userFind = await userModal.findOne({ email, password });

    if (userFind && userFind.password === password) {
      response
        .status(200)
        .json({ status: 'valid user', message: 'user matching confirm' });
    } else {
      response.status(404).json({ message: 'user not found' });
    }
  } catch (error) {
    response.status(500).json(error.message);
  }
});

// all use section under the comment ----------------------------
app.use((request, response, next) => {
  response.status(404).json({ message: 'route not found' });
});

app.use((error, request, response, next) => {
  response.status(404).json({ message: 'server not found' });
});

app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});
