var express = require('express');
const mongoose = require('mongoose');
var Battle = require('./model');

const Controller = require('./controller');
var _ = require('lodash');

// export MONGOLAB_URI="mongodb://dhope21:abhijeet21@ds147391.mlab.com:47391/gotbattle"
// mongoose connection
mongoose.connect(process.env.MONGOLAB_URI, function (error) {
  if (error) console.error(error);
  else console.log('mongo connected');
});

const app = express();

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

app.listen(3000, () => console.log('listening on port 3000!'));




