const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const server = express();

const Bears = require('./models.js');
// allow server to parse JSON bodies from POST/PUT/DELETE requests
server.use(bodyParser.json());
// TODO: write your server code here
server.post('/api/bears', (req, res) => {
  const newBear = new Bears(req.body);

  newBear.save((err, bear) => {
    if (err) res.status(STATUS_SERVER_ERROR).send({ error: 'Some useful error message' });
    else res.status(200).send(bear);
  });
});

server.get('/api/bears', (req, res) => {
  Bears.find({}, (err, bears) => {
    if (err) res.status(STATUS_SERVER_ERROR).send({ error: 'Some useful error message' });
    else res.status(200).send(bears);
  });
});

server.get('/api/bears/:id', (req, res) => {
  const { id } = req.params;

  Bears.findById(id, (err, bear) => {
    if (err) res.status(STATUS_SERVER_ERROR).send({ error: 'Some userful error message' });
    else res.status(200).send(bear);
  });
});

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
  'mongodb://localhost/bears',
  { useMongoClient: true }
);

/* eslint no-console: 0 */
connect.then(() => {
  const port = 3000;
  server.listen(port);
  console.log(`Server Listening on ${port}`);
}, (err) => {
  console.log('\n************************');
  console.log("ERROR: Couldn't connect to MongoDB. Do you have it running?");
  console.log('************************\n');
});
