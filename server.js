var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Battle = require('./model');
var config = require('./config'); 
var Controller = require('./controller');
var _ = require('lodash');
var jwt    = require('jsonwebtoken');
var port = process.env.PORT || 3000
var User = require('./user');
// mongoose connection
mongoose.connect(config.database);

const app = express();
app.set('superSecret', config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});


app.get('/', (req, res) => res.send('Hello World!'));



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



app.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: user.admin 
    };
        var token = jwt.sign(payload, app.get('superSecret'));

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});


app.listen(port, () => console.log('listening on port 3000!'));




