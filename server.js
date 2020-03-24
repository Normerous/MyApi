const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv');
const bodyParser = require('body-parser');

const { JWT_SECRET, PORT } = require('./config');

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.URL_MONGODB;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MogoDB database Success');
});

const user = require('./routes/user');
const exercise = require('./routes/exercise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express());

app.use('/user', user);
app.use('/exercise', exercise);

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
})