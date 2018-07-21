var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Battle = require('./model');
var config = require('./config'); 
var auth = require('./auth'); 
var Controller = require('./controller');
var _ = require('lodash');
var port = process.env.PORT || 3000
var User = require('./user');


// mongoose connection
mongoose.connect(config.database);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth);

app.get('/', (req, res) => res.send('Hello World!'));

// this request checks if the user has entered correct
// user name and password and returns a valid token
app.post('/authenticate',Controller.authenticate);

// returns the list of all battles
app.get('/list', (req, res) => {
  Battle.find({}, function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

// returns the total list of battles
app.get('/count', (req, res) => {
  Battle.count({}, function (err, data) {
    if (err) throw err;
    res.send({ "count": data });
  });
});

// allows to search in the list of battles
app.get('/search', (req, res) => {
  Battle.find(Controller.updateQuery(req.query), function (err, data) {
    if (err) throw err;
    res.send(data);
  });
});

// this request returns the statistics of all battles
app.get('/stats', Controller.getStats);


// this api is used fetch all user
app.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

app.listen(port, () => console.log('listening on port 3000!'));




