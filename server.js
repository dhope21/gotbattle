var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
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


app.post('/authenticate',Controller.authenticate);

// returns the list of all battels
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

app.get('/stats', Controller.getStats);



app.get('/createUser', function(req, res) {
  // create a sample user
  var newUser = new User({ 
    name: 'Arya Stark', 
    password: 'valarmorghulis',
    admin: true 
  });

  // save the sample user
  newUser.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});


app.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});   





app.listen(port, () => console.log('listening on port 3000!'));




